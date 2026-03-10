'use client';

import { supabase, type Group } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditGroupDialog } from './edit-group-dialog';
import { useState } from 'react';
import { toast } from 'sonner';

interface GroupsListProps {
  groups: Group[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string) => Promise<void>;
  onGroupDeleted: (groupId: string) => Promise<void>;
  onCreateGroup: () => void;
}

export function GroupsList({ groups, selectedGroupId, onSelectGroup, onGroupDeleted, onCreateGroup }: GroupsListProps) {
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const handleDelete = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group? This will delete all associated members and expenses.')) {
      return;
    }

    try {
      const { error } = await supabase.from('groups').delete().eq('id', groupId);

      if (error) throw error;

      onGroupDeleted(groupId);
      toast.success('Group deleted successfully');
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Groups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={onCreateGroup} className="w-full mb-4" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Group
        </Button>
        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No groups yet. Create one to get started!</p>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className={cn(
                'group relative flex items-center justify-between p-3 rounded-sm border cursor-pointer transition-colors',
                selectedGroupId === group.id
                  ? 'bg-accent border-primary'
                  : 'hover:bg-accent/50 border-transparent hover:border-border',
              )}
              onClick={() => {
                onSelectGroup(group.id);
              }}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{group.name}</h3>
                {group.description && <p className="text-sm text-muted-foreground truncate">{group.description}</p>}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100" />}
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
          ))
        )}
      </CardContent>
      {editingGroup && (
        <EditGroupDialog
          group={editingGroup}
          open={!!editingGroup}
          onOpenChange={(open) => !open && setEditingGroup(null)}
          onGroupUpdated={() => {
            // onGroupUpdated is called by EditGroupDialog after successful update
            // The group update is handled by TanStack Query cache invalidation
            setEditingGroup(null);
          }}
        />
      )}
    </Card>
  );
}
