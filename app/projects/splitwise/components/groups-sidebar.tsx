'use client';

import { useState, useEffect } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import { type Group } from '@/lib/supabase';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/registry/sidebar';
import { Button } from '@/registry/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/registry/dropdown-menu';
import { MoreVertical, Plus, Pencil, Trash2, Smile } from 'lucide-react';
import { EditGroupDialog } from './edit-group-dialog';
import { CreateGroupDialog } from './create-group-dialog';
import { useGroups, useDeleteGroup } from '../hooks/use-groups';

export function GroupsSidebar() {
  const { data: groups = [], isLoading } = useGroups();
  const [selectedGroupId, setSelectedGroupId] = useQueryState('group_id', parseAsString);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const deleteGroup = useDeleteGroup();

  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId, setSelectedGroupId]);

  useEffect(() => {
    if (selectedGroupId && groups.length > 0) {
      const groupExists = groups.some((g) => g.id === selectedGroupId);
      if (!groupExists && groups.length > 0) {
        setSelectedGroupId(groups[0].id);
      }
    }
  }, [selectedGroupId, groups, setSelectedGroupId]);

  const handleDelete = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group? This will delete all associated members and expenses.')) {
      return;
    }

    deleteGroup.mutate(groupId, {
      onSuccess: () => {
        const remainingGroups = groups.filter((g) => g.id !== groupId);
        if (selectedGroupId === groupId) {
          if (remainingGroups.length > 0) {
            setSelectedGroupId(remainingGroups[0].id);
          } else {
            setSelectedGroupId(null);
          }
        }
      },
    });
  };

  const handleGroupCreated = async (group: Group) => {
    await setSelectedGroupId(group.id);
    setCreateGroupOpen(false);
  };

  const handleGroupUpdated = () => {
    setEditingGroup(null);
  };

  return (
    <>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="border-b border-sidebar-border">
          <span className="text-lg font-semibold">Groups</span>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-2">
            <Button onClick={() => setCreateGroupOpen(true)} className="w-full" variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Group
            </Button>
          </div>
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading groups...</div>
          ) : groups.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No groups yet. Create one to get started!
            </div>
          ) : (
            <SidebarMenu>
              {groups.map((group) => (
                <SidebarMenuItem key={group.id}>
                  <div className="group relative flex w-full items-center gap-1">
                    <SidebarMenuButton
                      isActive={selectedGroupId === group.id}
                      onClick={() => setSelectedGroupId(group.id)}
                      className="flex-1 justify-start"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {group.icon ? (
                          <span className="text-lg shrink-0">{group.icon}</span>
                        ) : (
                          <Smile className="size-4" />
                        )}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="truncate font-medium">{group.name}</div>
                          {group.description && (
                            <div className="truncate text-xs text-muted-foreground">{group.description}</div>
                          )}
                        </div>
                      </div>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 shrink-0"
                          />
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingGroup(group);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(group.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarContent>
      </Sidebar>

      <CreateGroupDialog open={createGroupOpen} onOpenChange={setCreateGroupOpen} onGroupCreated={handleGroupCreated} />

      {editingGroup && (
        <EditGroupDialog
          group={editingGroup}
          open={!!editingGroup}
          onOpenChange={(open) => !open && setEditingGroup(null)}
          onGroupUpdated={handleGroupUpdated}
        />
      )}
    </>
  );
}
