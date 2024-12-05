import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { ProjectDatum } from "~/types/db"
import CopyableHash from "~/components/ui/CopyableHash"

export default function ProjectTable({ projects }: { projects: ProjectDatum[] }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Published Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Hash</TableHead>
              <TableHead>Task Hash</TableHead>
              <TableHead className="text-right">Max Commitments</TableHead>
              <TableHead>Contributors</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.project_hash}>
                <TableCell>
                  <CopyableHash hash={project.project_hash} />
                </TableCell>
                <TableCell>
                  <CopyableHash hash={project.escrow_hash} />
                </TableCell>
                <TableCell className="text-right">
                  {project.commitment_allowed}
                </TableCell>
                <TableCell>
                  {project.allowed_contributors.length} allowed
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
