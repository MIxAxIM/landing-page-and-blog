import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { type Course } from "~/types/db";
import { useState } from "react";
import { useRouter } from "next/router";
import { useRoles } from "~/hooks/app/useRoles";
import { AccessTier } from "@prisma/client";

interface UseCourseReturn {
  course: Course | null | undefined;
  isLoading: boolean;
  createCourse: (data: {
    courseNftPolicyId?: string;
    courseCode: string;
    title: string;
    createdById: string;
    description?: string;
    category?: string;
    imageUrl?: string;
    videoUrl?: string;
  }) => void;
  updateCourse: (data: {
    courseCode: string;
    title: string;
    courseNftPolicyId?: string;
    live?: boolean;
    description?: string;
    category?: string;
    imageUrl?: string;
    videoUrl?: string;
    accessTier?: AccessTier;
  }) => void;
  deleteCourse: (data: { id: string }) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  courseError: string | null;
}

export default function useCourse(courseCode?: string): UseCourseReturn {
  const ctx = api.useUtils();
  const [appError, setAppError] = useState<string | null>(null);
  const router = useRouter();
  const { updateCreatorOnboardingStatus } = useRoles();

  // Query for getting course data
  const { data: course, isLoading } = api.course.getCourse.useQuery(
    { courseCode: courseCode ?? "" },
    { enabled: !!courseCode }
  );

  // Mutation for creating a new course
  const createCourseMutation = api.course.create.useMutation({
    onSuccess: (data) => {
      toast.success("Course created!");
      // Invalidate both the specific course and the full course list
      if (courseCode) void ctx.course.getCourse.invalidate({ courseCode: courseCode ?? "" });;
      void ctx.course.getCourses.invalidate();
      void updateCreatorOnboardingStatus(data.createdById, "PARTIAL");
      router.push(`/studio/${data.id}`);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Some inputs are missing or invalid");
      } else if (!!e.shape?.message) {
        toast.error(e.shape.message);
        setAppError(e.shape.message);
      } else {
        toast.error(JSON.stringify(e));
      }
    },
  });

  // Mutation for updating a course
  const updateCourseMutation = api.course.update.useMutation({
    onSuccess: () => {
      toast.success("Course updated!");
      // Invalidate both the specific course and the full course list
      if (courseCode) void ctx.course.getCourse.invalidate({ courseCode: courseCode ?? "" });
      void ctx.course.getCourses.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Some inputs are missing or invalid");
      } else {
        toast.error("Failed to update course");
      }
    },
  });

  // Mutation for deleting a course
  const deleteCourseMutation = api.course.delete.useMutation({
    onSuccess: () => {
      toast.success("Course deleted!");
      void ctx.course.getCourses.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete course");
    },
  });

  return {
    course,
    isLoading,
    createCourse: createCourseMutation.mutate,
    updateCourse: updateCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,
    isCreating: createCourseMutation.isLoading,
    isUpdating: updateCourseMutation.isLoading,
    isDeleting: deleteCourseMutation.isLoading,
    courseError: appError,
  };
}
