import { api } from "~/utils/api";

export default function useProjectById({ id }: { id: string }) {
  const { data: project, isLoading: isLoadingProject } =
    api.project.getProjectById.useQuery({
      id: id,
    });

  return { project, isLoadingProject };
}
