import { api } from "~/utils/api";

export default function useProjects() {
  const { data: projects, isLoading: isLoadingProjects } =
    api.project.getProjects.useQuery({});

  return { projects, isLoadingProjects };
}
