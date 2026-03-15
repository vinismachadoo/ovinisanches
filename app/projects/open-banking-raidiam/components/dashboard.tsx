'use client';

import { Badge } from '@/registry/badge';
import { Button } from '@/registry/button';
import { Combobox } from '@/registry/combobox';
import { Label } from '@/registry/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/select';
import { Separator } from '@/registry/separator';
import { cn } from '@/lib/utils';
import { CircleCheck, CircleX, XIcon } from 'lucide-react';
import Image from 'next/image';
import { parseAsString, useQueryState } from 'nuqs';
import React from 'react';
import openBankingData from '../data/open-banking-servers-participants.json';
import {
  AuthorisationServer,
  checkPaymentsPixResource,
  DEFAULT_REQUIREMENTS_TO_VALIDATE,
  Participant,
  REQUIREMENTS_TO_SHOW_IN_CARD,
  supportsContactlessPix,
} from '../utils';

const DashboardPage = () => {
  const data = openBankingData as Participant[];

  const [selectedParticipantId] = useQueryState('selectedParticipantId', parseAsString.withDefault(''));

  const [selectedServerId] = useQueryState('selectedServerId', parseAsString.withDefault(''));

  const [hasEnrollmentsResourceStr] = useQueryState('hasEnrollmentsResource', parseAsString.withDefault(''));
  const hasEnrollmentsResource = hasEnrollmentsResourceStr === '' ? null : hasEnrollmentsResourceStr === 'true';

  const [hasPaymentsConsentsResourceStr] = useQueryState('hasPaymentsConsentsResource', parseAsString.withDefault(''));
  const hasPaymentsConsentsResource =
    hasPaymentsConsentsResourceStr === '' ? null : hasPaymentsConsentsResourceStr === 'true';

  const [hasPaymentsPixResourceStr] = useQueryState('hasPaymentsPixResource', parseAsString.withDefault(''));
  const hasPaymentsPixResource = hasPaymentsPixResourceStr === '' ? null : hasPaymentsPixResourceStr === 'true';

  const [supportsDCRStr] = useQueryState('supportsDCR', parseAsString.withDefault(''));
  const supportsDCR = supportsDCRStr === '' ? null : supportsDCRStr === 'true';

  const [supportsRedirectStr] = useQueryState('supportsRedirect', parseAsString.withDefault(''));
  const supportsRedirect = supportsRedirectStr === '' ? null : supportsRedirectStr === 'true';

  const selectedServer = data
    .find((item: Participant) =>
      item.AuthorisationServers?.find(
        (server: AuthorisationServer) => server.AuthorisationServerId === selectedServerId,
      ),
    )
    ?.AuthorisationServers?.find((server: AuthorisationServer) => server.AuthorisationServerId === selectedServerId);

  const applyFilters = React.useCallback(() => {
    let newData = data
      .map((item: Participant) => item.AuthorisationServers?.map((server: AuthorisationServer) => server) ?? [])
      .flat();
    if (selectedParticipantId) {
      newData = newData.filter((server: AuthorisationServer) => server.OrganisationId === selectedParticipantId);
    }
    if (selectedServerId) {
      newData = newData.filter((server: AuthorisationServer) => server.AuthorisationServerId === selectedServerId);
    }
    if (hasEnrollmentsResource !== null) {
      newData = newData.filter(
        (server: AuthorisationServer) =>
          supportsContactlessPix(server).hasEnrollmentsResource === hasEnrollmentsResource,
      );
    }
    if (hasPaymentsConsentsResource !== null) {
      newData = newData.filter(
        (server: AuthorisationServer) =>
          supportsContactlessPix(server).hasPaymentsConsentsResource === hasPaymentsConsentsResource,
      );
    }
    if (hasPaymentsPixResource !== null) {
      newData = newData.filter(
        (server: AuthorisationServer) =>
          supportsContactlessPix(server).hasPaymentsPixResource === hasPaymentsPixResource,
      );
    }
    if (supportsDCR !== null) {
      newData = newData.filter(
        (server: AuthorisationServer) => supportsContactlessPix(server).supportsDCR === supportsDCR,
      );
    }
    if (supportsRedirect !== null) {
      newData = newData.filter(
        (server: AuthorisationServer) => supportsContactlessPix(server).supportsRedirect === supportsRedirect,
      );
    }
    return newData;
  }, [
    data,
    selectedParticipantId,
    selectedServerId,
    hasEnrollmentsResource,
    hasPaymentsConsentsResource,
    hasPaymentsPixResource,
    supportsDCR,
    supportsRedirect,
  ]);

  const filteredData = applyFilters();

  return (
    <div className="flex flex-col h-dvh justify-center w-full min-w-0">
      <div className="relative flex flex-col flex-1 items-start w-full h-full min-w-0 min-h-0">
        <div className="w-full h-full flex flex-col">
          <div className="p-4">
            <h1 className="text-2xl font-bold">Open Banking - Contactless PIX - Raidiam Case</h1>
          </div>

          <Separator />

          <MetricsSection data={data} />

          <Separator />

          <div className="flex flex-col gap-y-4 p-4 min-h-0 h-full">
            <FilterSection data={data} />

            <div className="flex gap-x-4 min-h-0 h-full">
              <div className="flex flex-col gap-y-4 min-h-0 w-full">
                <span className="font-medium">{filteredData.length} results</span>

                <div className="grid grid-cols-3 items-start gap-4 h-fit min-h-0 overflow-auto">
                  {filteredData.map((server: AuthorisationServer) => (
                    <AuthServerCard key={server.AuthorisationServerId} server={server} />
                  ))}
                </div>
              </div>

              <Separator orientation="vertical" />

              <div className="flex w-full h-full min-w-0 min-h-0 max-w-full max-h-full rounded-sm border p-2 overflow-auto">
                {selectedServer ? (
                  <pre>
                    <code>{JSON.stringify(selectedServer, null, 2)}</code>
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <p>Select server to see details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricsSectionProps {
  data: Participant[];
}

const MetricsSection = ({ data }: MetricsSectionProps) => {
  // participants
  const participantsAmount = data.length;
  const activeParticipantsAmount = data.filter((item: Participant) => item.Status === 'Active').length;

  // authorization servers
  const listOfServers = data.map((item: Participant) => item.AuthorisationServers).flat();
  const serversAmount = listOfServers.length;
  const activeServersAmount = listOfServers.filter(
    (server: AuthorisationServer | undefined) => server?.Status === 'Active',
  ).length;

  const serversWithSupportToContactlessPix = listOfServers.filter(
    (server: AuthorisationServer | undefined) =>
      server && supportsContactlessPix(server, DEFAULT_REQUIREMENTS_TO_VALIDATE).hasAllRequirements,
  );
  const participantsWithSupportToContactlessPix = [
    ...new Set(
      serversWithSupportToContactlessPix.map((server: AuthorisationServer | undefined) => server?.OrganisationId),
    ),
  ];

  const serversWithSupportToPaymentsPix = listOfServers.filter(
    (server: AuthorisationServer | undefined) => server && checkPaymentsPixResource(server),
  );
  const participantsWithSupportToPaymentsPix = [
    ...new Set(
      serversWithSupportToPaymentsPix.map((server: AuthorisationServer | undefined) => server?.OrganisationId),
    ),
  ];

  const serversWithSupportToPaymentsPixAmount = serversWithSupportToPaymentsPix.length;

  return (
    <div className="flex gap-x-4 justify-between p-4">
      <div className="flex flex-col gap-2 border rounded-sm p-4 h-fit max-w-80 w-fit border-l-3 border-l-orange-400">
        <div className="flex gap-2 items-center">
          <p className="text-muted-foreground">Total participants</p>
          <p className="text-lg font-bold">{participantsAmount}</p>
        </div>

        <div className="flex gap-2">
          <div className="flex justify-between items-center gap-x-2">
            <Badge className="bg-green-500 text-white">Active</Badge>
            <span>{activeParticipantsAmount}</span>
          </div>

          <div className="flex justify-between items-center gap-x-2">
            <Badge className="bg-red-500 text-white">Inactive</Badge>
            <span>{participantsAmount - activeParticipantsAmount}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border rounded-sm p-4 h-fit max-w-80 w-fit border-l-3 border-l-orange-400">
        <div className="flex gap-2 items-center">
          <p className="text-muted-foreground">Total servers</p>
          <p className="text-lg font-bold">{serversAmount}</p>
        </div>

        <div className="flex gap-2">
          <div className="flex justify-between items-center gap-x-2">
            <Badge className="bg-green-500 text-white">Active</Badge>
            <span>{activeServersAmount}</span>
          </div>

          <div className="flex justify-between items-center gap-x-2">
            <Badge className="bg-red-500 text-white">Inactive</Badge>
            <span>{serversAmount - activeServersAmount}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border rounded-sm p-4 h-fit max-w-md w-fit border-l-3 border-l-orange-400">
        <div className="flex gap-2 items-center">
          <p className="text-muted-foreground">Servers with support to pix payments</p>
          <p className="text-lg font-bold">{serversWithSupportToPaymentsPixAmount}</p>
        </div>
        <Badge>from {participantsWithSupportToPaymentsPix.length} participants</Badge>
      </div>

      <div className="flex flex-col gap-2 border rounded-sm p-4 h-fit max-w-160 w-fit border-l-3 border-l-orange-400">
        <div className="flex gap-2 items-center">
          <p className="text-muted-foreground">Servers with support to contactless pix</p>
          <p className="text-lg font-bold">{serversWithSupportToContactlessPix.length}</p>
        </div>

        <Badge>from {participantsWithSupportToContactlessPix.length} participants</Badge>
      </div>

      <div className="flex flex-col gap-2 border rounded-sm p-4 h-fit max-w-160 w-fit border-l-3 border-l-orange-400">
        <div className="flex gap-2 items-center">
          <p className="text-muted-foreground">Required ApiFamilyType </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['enrollments', 'payments-consents', 'payments-pix'].map((requirement) => (
            <Badge key={requirement} variant="outline">
              {requirement}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ data }: { data: Participant[] }) => {
  const participantsListOptions = data.map((item: Participant) => ({
    label: item.OrganisationName,
    value: item.OrganisationId,
    filterValue: item.OrganisationName,
  }));

  const [selectedParticipantId, setSelectedParticipantId] = useQueryState(
    'selectedParticipantId',
    parseAsString.withDefault(''),
  );
  const [selectedServerId, setSelectedServerId] = useQueryState('selectedServerId', parseAsString.withDefault(''));

  const [hasEnrollmentsResource, setHasEnrollmentsResource] = useQueryState(
    'hasEnrollmentsResource',
    parseAsString.withDefault(''),
  );

  const [hasPaymentsConsentsResource, setHasPaymentsConsentsResource] = useQueryState(
    'hasPaymentsConsentsResource',
    parseAsString.withDefault(''),
  );
  const [hasPaymentsPixResource, setHasPaymentsPixResource] = useQueryState(
    'hasPaymentsPixResource',
    parseAsString.withDefault(''),
  );
  const [supportsDCR, setSupportsDCR] = useQueryState('supportsDCR', parseAsString.withDefault(''));
  const [supportsRedirect, setSupportsRedirect] = useQueryState('supportsRedirect', parseAsString.withDefault(''));

  return (
    <div className="flex gap-x-2">
      <div className="flex flex-col gap-y-2 border rounded-sm p-2">
        <Label>Participant</Label>
        <div className="flex gap-x-2">
          <Combobox
            items={participantsListOptions.map((item) => ({
              label: item.label,
              value: item.value,
            }))}
            value={selectedParticipantId}
            onValueChange={(value) => {
              setSelectedParticipantId(value as string);
              setSelectedServerId('');
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="w-fit self-end"
            onClick={() => {
              setSelectedParticipantId('');
              setSelectedServerId('');
            }}
            disabled={!(selectedParticipantId || selectedServerId)}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 border rounded-sm p-2">
        <Label>hasEnrollmentsResource</Label>
        <div className="flex gap-x-2">
          <Select
            value={hasEnrollmentsResource}
            onValueChange={(value) => {
              console.log(value);
              setHasEnrollmentsResource(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="w-fit self-end"
            onClick={() => {
              setHasEnrollmentsResource('');
            }}
            disabled={hasEnrollmentsResource === ''}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 border rounded-sm p-2">
        <Label>hasPaymentsConsentsResource</Label>
        <div className="flex gap-x-2">
          <Select
            value={hasPaymentsConsentsResource}
            onValueChange={(value) => {
              setHasPaymentsConsentsResource(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="w-fit self-end"
            onClick={() => {
              setHasPaymentsConsentsResource('');
            }}
            disabled={hasPaymentsConsentsResource === ''}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 border rounded-sm p-2">
        <Label>hasPaymentsPixResource</Label>
        <div className="flex gap-x-2">
          <Select
            value={hasPaymentsPixResource}
            onValueChange={(value) => {
              setHasPaymentsPixResource(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="w-fit self-end"
            onClick={() => {
              setHasPaymentsPixResource('');
            }}
            disabled={hasPaymentsPixResource === ''}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 border rounded-sm p-2">
        <Label>supportsDCR</Label>
        <div className="flex gap-x-2">
          <Select
            value={supportsDCR}
            onValueChange={(value) => {
              setSupportsDCR(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="w-fit self-end"
            onClick={() => {
              setSupportsDCR('');
            }}
            disabled={supportsDCR === ''}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 border rounded-sm p-2">
        <Label>supportsRedirect</Label>
        <div className="flex gap-x-2">
          <Select
            value={supportsRedirect}
            onValueChange={(value) => {
              setSupportsRedirect(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="w-fit self-end"
            onClick={() => {
              setSupportsRedirect('');
            }}
            disabled={supportsRedirect === ''}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* <div className="flex flex-col justify-end p-2">
        <Button
          variant="outline"
          size="sm"
          className="w-fit self-end"
          onClick={() => {
            setSelectedParticipantId('');
            setSelectedServerId('');
          }}
          disabled={!(selectedParticipantId || selectedServerId)}
        >
          <XIcon className="size-4" />
          Reset
        </Button>
      </div> */}
    </div>
  );
};

const AuthServerCard = ({ server }: { server: AuthorisationServer }) => {
  const [, setSelectedParticipantId] = useQueryState('selectedParticipantId', parseAsString.withDefault(''));
  const [selectedServerId, setSelectedServerId] = useQueryState('selectedServerId', parseAsString.withDefault(''));

  const supportsContactlessPixResult = supportsContactlessPix(server, REQUIREMENTS_TO_SHOW_IN_CARD);

  return (
    <div
      className={cn(
        'flex flex-col gap-2 border rounded-sm p-4 h-full max-w-80 w-full relative',
        selectedServerId === server.AuthorisationServerId && 'bg-muted border-black',
      )}
    >
      <div className="flex items-center gap-2">
        <Image src={server.CustomerFriendlyLogoUri} alt={server.CustomerFriendlyName} width={20} height={20} />
        <span className="font-bold">{server.CustomerFriendlyName}</span>
      </div>

      <div>
        {supportsContactlessPixResult &&
          REQUIREMENTS_TO_SHOW_IN_CARD.map((requirement) => {
            return (
              <div key={requirement} className="flex items-center gap-2">
                <p>
                  {supportsContactlessPixResult[requirement as keyof typeof supportsContactlessPixResult] ? (
                    <CircleCheck className="size-4 text-green-500" />
                  ) : (
                    <CircleX className="size-4 text-red-500" />
                  )}
                </p>
                <p>{requirement}</p>
              </div>
            );
          })}
      </div>

      <Button
        onClick={() => {
          setSelectedParticipantId(server.OrganisationId);
          setSelectedServerId(server.AuthorisationServerId);
        }}
      >
        Check API content
      </Button>

      {selectedServerId === server.AuthorisationServerId && (
        <Button
          size="sm"
          className="w-fit self-end absolute top-2 right-2 rounded-full"
          onClick={() => {
            setSelectedParticipantId('');
            setSelectedServerId('');
          }}
        >
          <XIcon className="size-3" />
        </Button>
      )}
    </div>
  );
};

export default DashboardPage;
