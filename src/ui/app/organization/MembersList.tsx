import { PlusIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useOrganizationMembers } from "~/hooks/organization/useOrganizationMembers";

export default function MembersList({ organizationId }: { organizationId: string }) {
  const { members, addMember } = useOrganizationMembers(organizationId);
  const [isAddingMember, setIsAddingMember] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Members</CardTitle>
          <CardDescription>{members?.length} members in organization</CardDescription>
        </div>
        <Button
          onClick={() => setIsAddingMember(!isAddingMember)}
          size="sm"
          className="ml-2"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members?.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.user.image ?? undefined} />
                  <AvatarFallback>
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {member.user.name ?? "Unnamed User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.user.email}
                  </p>
                </div>
              </div>
              <Select
                defaultValue={member.role}
                disabled={member.role === "OWNER"}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNER">Owner</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="GUEST">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}

          {members?.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No members found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
