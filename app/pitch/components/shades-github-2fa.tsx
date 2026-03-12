'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyMedia } from '@/components/ui/empty';
import { Field, FieldDescription } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Github } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const ShadesGithub2FA = ({ className, ...props }: React.ComponentProps<typeof Card>) => {
  const [otp, setOtp] = React.useState<string>('');

  const handleVerify = () => {
    toast.success('OTP verified successfully');
    setOtp('');
  };

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>Verify your identity</CardDescription>
      </CardHeader>
      <CardContent className="px-10">
        <div className="flex flex-col gap-y-6 items-center justify-center">
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <EmptyMedia variant="icon" className="bg-foreground text-background rounded-full">
              <Github className="size-5" />
            </EmptyMedia>

            <Field className="w-full">
              <InputOTP
                id="otp-verification"
                className="w-full"
                containerClassName="w-full"
                value={otp}
                onChange={setOtp}
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup className="w-full justify-center">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <FieldDescription className="text-center">
                The code has been sent to your email. If you didn&apos;t receive it, please check your spam folder or{' '}
                <span className="underline underline-offset-2 cursor-pointer text-primary">request a new code.</span>
              </FieldDescription>
            </Field>
          </div>

          <Button onClick={handleVerify} disabled={otp.length !== 6}>
            Verify
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShadesGithub2FA;
