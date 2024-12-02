import { useEffect, useState } from "react";
import { type CourseVariant } from "~/types/db";
import { api } from "~/utils/api";

export default function useCourseVariants(courseId: string | undefined) {
  const [listCourseVariant, setListCourseVariant] = useState([
    { name: "Main", value: "main" },
  ]);
  const [selectedVariantName, setSelectedVariantName] =
    useState<string>("main");
  const [selectedCourseVariant, setSelectedCourseVariant] = useState<
    CourseVariant | undefined
  >(undefined);

  const { data: courseVariants } = api.courseVariant.getCourseVariants.useQuery(
    {
      courseId: courseId ?? "",
    },
    {
      enabled: courseId != undefined,
    },
  );

  useEffect(() => {
    if (courseVariants) {
      const _tabs = [{ name: "Main", value: "main" }];
      courseVariants.map((variant) => {
        _tabs.push({ name: variant.variantCode, value: variant.variantCode });
      });
      setListCourseVariant(_tabs);
    }
  }, [courseVariants]);

  useEffect(() => {
    if (courseVariants) {
      const _courseVariant = courseVariants.find(
        (x) => x.variantCode == selectedVariantName,
      );
      if (_courseVariant) {
        setSelectedCourseVariant(_courseVariant);
      } else {
        setSelectedCourseVariant(undefined);
      }
    }
  }, [selectedVariantName, courseVariants]);

  return {
    courseVariants,
    listCourseVariant,
    selectedVariantName,
    setSelectedVariantName,
    selectedCourseVariant,
  };
}
