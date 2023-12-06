import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
// upload course

export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);
// edit ourse
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });
        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const courseId = req.params.id;
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );
      res.status(201).json({
        success: true,
        course,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// get single course --- who have not purchased teh course

export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;
      const doesCascheExist = await redis.get(courseId);
      if (doesCascheExist) {
        const course = JSON.parse(doesCascheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.links -courseData.questions"
        );
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

//  get all courses --- without purchasing
export const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doesCascheExist = await redis.get("allCourses");
      if (doesCascheExist) {
        const courses = JSON.parse(doesCascheExist);
        res.status(200).json({
          success: true,
          courses,
        });
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.links -courseData.questions"
        );
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// get course with content only for authentice users who bought course
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id as string;
      console.log(userCourseList);
      const courseExists = userCourseList?.find(
        (course: any) => course.courseId.toString() === courseId
      );
      if (!courseExists) {
        return next(new ErrorHandler(`Course not found`, 400));
      }
      const course = await CourseModel.findById(req.params.id);
      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// add question in course

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestionData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;

      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }
      console.log(course);
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid course content", 400));
      }
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };
      courseContent.questions.push(newQuestion);
      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question",
        message: `You have new Question in ${courseContent.title}`,
      });
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);
// add answer to questions

interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}
export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 400));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid course content", 400));
      }
      const question = courseContent?.questions?.find((Item: any) =>
        Item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("invalid question id", 400));
      }
      const newAnswer: any = {
        user: req.user,
        answer,
      };
      question?.questionReplies?.push(newAnswer);

      await course?.save();
      if (req.user?._id === question.user._id) {
        // create a notification
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Question Reply Recieved",
          message: `You have new Question Reply in ${courseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-reply.ejs"),
          data
        );
        try {
          await sendMail({
            email: question.user.email,
            subject: "question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (err: any) {}
      }

      res.status(200).json({ success: true, course });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);
// add review in course
interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      console.log(req.user);
      const courseId = req.params.id;
      const courseExists = userCourseList?.find((course: any) => {
        // console.log(course._id === courseId);
        // console.log(course._id == courseId);
        // console.log(course._id, courseId);
        return course.courseId === courseId.toString();
      });
      if (!courseExists) {
        return next(
          new ErrorHandler("your not elgible to access this course ", 400)
        );
      }
      const course = await CourseModel.findById(courseId);
      const { review, rating } = req.body as IAddReviewData;
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };
      course?.reviews.push(reviewData);
      let avg = 0;
      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });
      if (course) {
        course.ratings = avg / course.reviews.length;
      }
      await course?.save();
      const notification = {
        title: "New Review Recieved",
        message: `${req.user?.name} has given a review in ${course?.name}`,
      };
      res.status(200).json({ success: true, course });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// add reply in review and only admin can
interface IAddReviewReplyData {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewReplyData;
      const course = await CourseModel.findById(courseId);
      if (!course)
        return next(new ErrorHandler("could not find the course", 400));
      const review = course?.reviews.find(
        (rev: any) => rev._id.toString() === reviewId
      );
      if (!review) {
        return next(new ErrorHandler("could not find the review", 400));
      }
      const replyData: any = {
        user: req.user,
        comment,
      };
      if (!review.commentReplies) review.commentReplies = [];
      review.commentReplies.push(replyData);
      await course?.save();
      res.status(200).json({ success: true, course });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// get all courses -- only for admin
export const getTotalCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);
