import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/card';
import { Field, FieldContent, FieldLabel } from '@/registry/field';
import { Switch } from '@/registry/switch';
import { cn } from '@/lib/utils';
import { Bell, Mail, MessageCircle, MessageSquare, Send, Slack } from 'lucide-react';
import React from 'react';

const ShadesNotifications = ({ className, ...props }: React.ComponentProps<typeof Card>) => {
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage your channels</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-3">
        <Field orientation="horizontal">
          <FieldContent>
            <div className="flex items-center gap-x-2">
              <Mail className="size-4 text-muted-foreground" />
              <FieldLabel htmlFor="switch-email">Email</FieldLabel>
            </div>
          </FieldContent>
          <Switch id="switch-email" defaultChecked />
        </Field>

        <Field orientation="horizontal">
          <FieldContent>
            <div className="flex items-center gap-x-2">
              <MessageSquare className="size-4 text-muted-foreground" />
              <FieldLabel htmlFor="switch-sms">SMS</FieldLabel>
            </div>
          </FieldContent>
          <Switch id="switch-sms" />
        </Field>

        <Field orientation="horizontal">
          <FieldContent>
            <div className="flex items-center gap-x-2">
              <MessageCircle className="size-4 text-muted-foreground" />
              <FieldLabel htmlFor="switch-whatsapp">WhatsApp</FieldLabel>
            </div>
          </FieldContent>
          <Switch id="switch-whatsapp" defaultChecked />
        </Field>

        <Field orientation="horizontal">
          <FieldContent>
            <div className="flex items-center gap-x-2">
              <Bell className="size-4 text-muted-foreground" />
              <FieldLabel htmlFor="switch-push">Push</FieldLabel>
            </div>
          </FieldContent>
          <Switch id="switch-push" />
        </Field>

        <Field orientation="horizontal">
          <FieldContent>
            <div className="flex items-center gap-x-2">
              <Send className="size-4 text-muted-foreground" />
              <FieldLabel htmlFor="switch-telegram">Telegram</FieldLabel>
            </div>
          </FieldContent>
          <Switch id="switch-telegram" />
        </Field>

        <Field orientation="horizontal">
          <FieldContent>
            <div className="flex items-center gap-x-2">
              <Slack className="size-4 text-muted-foreground" />
              <FieldLabel htmlFor="switch-slack">Slack</FieldLabel>
            </div>
          </FieldContent>
          <Switch id="switch-slack" defaultChecked />
        </Field>
      </CardContent>
    </Card>
  );
};

export default ShadesNotifications;
