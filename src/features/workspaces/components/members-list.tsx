"use client"

import { ArrowLeft, Loader, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { Fragment } from "react"

import DottedSeparator from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useDeleteMember } from "@/features/members/api/use-delete-member"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useUpdateMember } from "@/features/members/api/use-update-member"
import MemberAvatar from "@/features/members/components/member-avatar"
import { MemberRole } from "@/features/members/types"
import { useConfirm } from "@/hooks/use-confirm"

import { useWorkspaceId } from "../hooks/use-workspace-id"

export default function MembersList() {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { data: members, isPending: isLoadingMembers } = useGetMembers({ workspaceId })
  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember()
  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember()
  const [DeleteMemberDialog, confirmDeleteMember] = useConfirm(
    '确定要删除该成员吗？',
    '删除后，该成员将无法访问当前工作区。',
    'destructive'
  )

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirmDeleteMember()
    if (!ok) return null

    deleteMember({ param: { memberId } })
  }

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ param: { memberId }, json: { role } })
  }

  return (
    <Card className="w-full">
      <DeleteMemberDialog />
      <CardHeader className="flex gap-4">
        <CardTitle className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/workspaces/${workspaceId}`)}>
            <ArrowLeft className="size-4" />
            返回
          </Button>
          成员列表
        </CardTitle>
      </CardHeader>
      {isLoadingMembers ? (
        <div className='flex justify-center items-center h-[96px]'>
          <Loader className='size-4 animate-spin' />
        </div>
      ) : (
        <CardContent>
          <DottedSeparator className="mb-4" />
          {
            members && (
              members.documents.map((member, index) => (
                <Fragment key={member.$id}>
                  <div className="flex items-center gap-2">
                    <MemberAvatar name={member.name} className="size-10" fallbackClassName="size-5" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{member.name}</span>
                      <span className="text-xs text-neutral-500">{member.email}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="ml-auto" >
                          <MoreHorizontal className="size-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="bottom" align="end">
                        <DropdownMenuItem className="font-medium text-sm" onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)} disabled={isUpdatingMember}>
                          Set as MEMBER
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-medium text-sm" onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)} disabled={isUpdatingMember}>
                          Set as ADMINT
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-medium text-sm text-red-500" onClick={() => handleDeleteMember(member.$id)} disabled={isDeletingMember}>
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {index !== members.documents.length - 1 && <Separator className="my-2.5 text-neutral-300" />}
                </Fragment>
              ))
            )
          }
        </CardContent>
      )}
    </Card>
  )
}
