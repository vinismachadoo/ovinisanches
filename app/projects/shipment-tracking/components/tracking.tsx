'use client';

import OrderAttachmentsDialog from '@/app/projects/shipment-tracking/components/attachments-dialog';
import CarrierAvatar from '@/components/_backups/carrier-avatar';
import OrderProviderAvatar from '@/components/_backups/order-provider-avatar';
import { OrderStatus, OrderStatusBadge, OrderStatusColors, OrderTypes } from '@/components/_backups/order-status-badge';
import { OrderTypeBadge } from '@/components/_backups/order-type-badge';
import SellerChip from '@/components/_backups/seller-chip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { DoubleSidebarInset, DoubleSidebarTrigger } from '@/components/ui/double-sidebar';
import {
  MapCircle,
  Map as MapComponent,
  MapFeatureGroup,
  MapMarker,
  MapPolyline,
  MapTileLayer,
} from '@/components/ui/leaflet-map';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Timeline,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getStraightDistanceBetweenTwoPoints } from '@/lib/distances';
import { smartTrim } from '@/lib/strings';
import { formatTime, minutesToHour } from '@/lib/times';
import { cn } from '@/lib/utils';
import polylineDecode from '@mapbox/polyline';
import { formatDistance, formatDistanceToNow, formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'leaflet/dist/leaflet.css';
import {
  ArrowUpRight,
  BadgeAlert,
  BadgeCheck,
  BadgeX,
  BanknoteArrowDown,
  BanknoteArrowUp,
  ChevronDown,
  ChevronUp,
  CircleUser,
  EyeIcon,
  EyeOffIcon,
  House,
  ImageOff,
  LinkIcon,
  MapPinHouse,
  MousePointerClick,
  Package,
  Pencil,
  RefreshCcw,
  SquareAsterisk,
  Star,
  Store,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';
import type { Delivery, DeliveryEvent, Order } from '../data/order';
import { ORDER } from '../data/order';
import { POLYLINE } from '../data/polyline';

const ViewOrderPage = () => {
  const order = ORDER;
  const polyline = POLYLINE.polyline;

  const mapPolyline = polyline ? (polylineDecode.decode(polyline) as [number, number][]) : undefined;

  const [eventsToShow, setEventsToShow] = React.useState<Map<string, DeliveryEvent & { show: boolean }>>(new Map());

  React.useEffect(() => {
    setEventsToShow(
      new Map(
        order?.delivery_events
          .filter((event) => event.latitude && event.longitude)
          .map((event) => [event.id, { ...event, show: true }]) ?? [],
      ),
    );
  }, [order?.delivery_events]);

  const handleToggleEvent = (eventId: string) => {
    setEventsToShow((prev) => {
      const newMap = new Map(prev);
      const event = newMap.get(eventId);
      if (event) {
        newMap.set(eventId, {
          ...event,
          show: !event.show,
        });
      }
      return newMap;
    });
  };

  const handleToggleAllEvents = (show: boolean) => {
    setEventsToShow((prev) => {
      const newMap = new Map(prev);
      newMap.forEach((event) => {
        event.show = show;
      });
      return newMap;
    });
  };

  const [isLoading, setIsLoading] = React.useState(true);

  const loadData = React.useCallback(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="relative flex h-screen min-h-0 w-full min-w-0 flex-col items-center">
      <div className="min-h-svh flex w-full flex-col">
        {/* header */}
        <div className="flex h-(--header-height) w-full items-center justify-between border-b p-4">
          <div className="flex items-center gap-x-2">
            <DoubleSidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/orders-2" className="font-medium">
                    Pedidos
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">{order.id}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Button variant="ghost" onClick={() => loadData()}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Badge variant="destructive">Beta</Badge>
          </div>
        </div>

        <div className="flex flex-1">
          <DoubleSidebarInset className={cn('h-[calc(100vh-var(--header-height))] min-w-0')}>
            <div className="flex h-full min-h-0 w-full">
              <div className="flex-co flex h-full min-h-0 w-full gap-4 overflow-hidden overflow-y-auto p-4 lg:grid lg:grid-cols-[6fr_5fr_5fr]">
                {/* first column */}
                <div className="flex flex-col gap-y-4">
                  {order?.type !== OrderTypes.TAKEOUT ? (
                    <PromisedDeliveryDate data={order} isLoading={isLoading} />
                  ) : null}

                  <OrderTimetrack data={order} isLoading={isLoading} />

                  {order?.type !== OrderTypes.TAKEOUT ? <EstimatedDistance data={order} isLoading={isLoading} /> : null}

                  <OrderMapTracking
                    data={order}
                    isLoading={isLoading}
                    polyline={mapPolyline}
                    events={order?.delivery_events}
                    eventsToShow={eventsToShow}
                    handleToggleAllEvents={handleToggleAllEvents}
                  />

                  <DriverCard data={order} isLoading={isLoading} />
                </div>

                {/* second column */}
                <DeliveriesHistory
                  data={order}
                  isLoading={isLoading}
                  handleToggleEvent={handleToggleEvent}
                  eventsToShow={eventsToShow}
                />

                {/* third column */}
                <div className={cn('flex flex-col gap-y-4 overflow-y-auto', !isLoading && 'rounded-sm border p-4')}>
                  <GeneralOrderDetails data={order} isLoading={isLoading} />

                  <CustomerCard data={order} isLoading={isLoading} />

                  {order?.type !== OrderTypes.TAKEOUT ? <AddressCard data={order} isLoading={isLoading} /> : null}

                  <ReceiverAlert data={order} isLoading={isLoading} />

                  {order?.type !== OrderTypes.TAKEOUT ? (
                    <VerificationCodesAlert data={order} isLoading={isLoading} />
                  ) : null}

                  {order?.type !== OrderTypes.TAKEOUT ? <FreightRevenue data={order} isLoading={isLoading} /> : null}

                  <CsatAlert data={order} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </DoubleSidebarInset>
        </div>
      </div>
    </div>
  );
};

const GeneralOrderDetails = ({ data, isLoading = false }: { data?: Order; isLoading?: boolean }) => {
  return isLoading ? (
    <Skeleton className="flex h-fit min-h-72 w-full flex-col items-center justify-center" />
  ) : (
    <Alert className="h-fit min-h-72">
      <Package className="h-4 w-4" />
      <AlertTitle>{data?.number}</AlertTitle>
      <AlertDescription className="flex w-full flex-col gap-y-2 pt-2">
        <div className="flex w-full items-center justify-between gap-x-2">
          <span className="text-muted-foreground">ID Pedido</span>
          <span>{data?.id}</span>
        </div>

        <div className="flex w-full items-center justify-between gap-x-2">
          <span className="text-muted-foreground">Filial</span>
          <SellerChip baseStringToColor={data?.seller.id as string}>{data?.seller.trading_name}</SellerChip>
        </div>

        <div className="flex w-full items-center justify-between gap-x-2">
          <span className="text-muted-foreground">Origem do pedido</span>
          <div className="flex items-center gap-x-2">
            <OrderProviderAvatar order_integration_type={data?.creation_origin as string}>
              {data?.creation_origin}
            </OrderProviderAvatar>
            <span>{data?.creation_origin}</span>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-x-2">
          <span className="text-muted-foreground">Tipo de pedido</span>
          <OrderTypeBadge variant={data?.type as OrderTypes}>{data?.type}</OrderTypeBadge>
        </div>

        <div className="flex w-full items-center justify-between gap-x-2">
          <span className="text-muted-foreground">Rastreio</span>
          <span>{data?.tracking}</span>
        </div>

        <div className="flex w-full items-center justify-between gap-x-2">
          <span className="text-muted-foreground">Marcadores</span>
          <span>Em breve</span>
        </div>

        <Button variant="outline" className="mt-2 w-full">
          Ver mais
        </Button>
      </AlertDescription>
    </Alert>

    // Nota fiscal: {data?.invoice_number}- Data de emissão da nota fiscal:{' '}
    // {formatTime(data?.external_created_at)}- Chave de acesso:{' '}
    // {data?.access_keys}- Filial: {data?.seller.trading_name}- Informações
  );
};

const EstimatedDistance = ({ data, isLoading = false }: { data?: Order; isLoading?: boolean }) => {
  return (
    <div className="flex h-12 w-full items-center">
      <div className="flex items-center justify-center rounded-sm border p-1 shadow">
        <div className="bg-muted flex items-center justify-center rounded-sm p-1.5">
          <Store className="h-4 w-4" />
        </div>
      </div>

      <div className="h-px w-full border-t border-dashed" />

      {isLoading ? (
        <Skeleton className="flex h-full w-full" />
      ) : (
        <div className="flex w-fit flex-col items-center text-sm">
          <span className="whitespace-nowrap rounded-sm bg-violet-400/10 px-2 py-1 font-medium text-violet-500">
            {!data?.estimated_distance_meters
              ? 'Distância dirigida desconhecida'
              : `Distância dirigida estimada ≈ ${
                  data?.estimated_distance_meters > 1000
                    ? `${(data?.estimated_distance_meters / 1000).toFixed(2)} km`
                    : `${data?.estimated_distance_meters} m`
                }`}
          </span>
        </div>
      )}

      <div className="h-px w-full border-t border-dashed" />

      <div className="flex items-center justify-center rounded-sm border p-1 shadow">
        <div className="bg-muted flex items-center justify-center rounded-sm p-1.5">
          <House className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

const OrderMapTracking = ({
  data,
  isLoading,
  polyline,
  bbox,
  events,
  eventsToShow,
  handleToggleAllEvents,
}: {
  data?: Order;
  isLoading: boolean;
  polyline?: [number, number][];
  bbox?: number[];
  events?: Order['delivery_events'];
  eventsToShow: Map<string, DeliveryEvent & { show: boolean }>;
  handleToggleAllEvents: (show: boolean) => void;
}) => {
  const STORE_LOCATION: [number, number] = [data?.source_address.latitude || 0, data?.source_address.longitude || 0];
  // if takeout it is empty
  const CUSTOMER_LOCATION: [number, number] = [
    data?.destination_address?.latitude || 0,
    data?.destination_address?.longitude || 0,
  ];
  // if takeout it is empty
  const DRIVER_LOCATION: [number, number] = [data?.last_delivery_latitude || 0, data?.last_delivery_longitude || 0];

  // if no bbox, use customer location
  const centerLat = ((bbox?.[1] || 0) + (bbox?.[3] || 0)) / 2 || DRIVER_LOCATION[0] || CUSTOMER_LOCATION[0];
  const centerLng = ((bbox?.[0] || 0) + (bbox?.[2] || 0)) / 2 || DRIVER_LOCATION[1] || CUSTOMER_LOCATION[1];
  const center = [centerLat, centerLng] as [number, number];

  const { resolvedTheme } = useTheme();

  const lastDelivery = data?.deliveries
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .at(-1);

  const allEventsVisible = Array.from(eventsToShow.values()).every((event) => event.show);

  const successfulEvent = events?.find((event) => event.status === OrderStatus.SUCCESSFUL);
  const successfulEventDistance = getStraightDistanceBetweenTwoPoints(
    successfulEvent?.latitude,
    successfulEvent?.longitude,
    CUSTOMER_LOCATION[0],
    CUSTOMER_LOCATION[1],
  );

  const isFinished = data?.status_name === OrderStatus.SUCCESSFUL;

  return isLoading ? (
    <Skeleton className="flex h-full min-h-96 w-full flex-col items-center justify-center gap-y-4 text-center" />
  ) : (
    <MapComponent
      center={data?.type === OrderTypes.TAKEOUT ? STORE_LOCATION : center}
      zoom={13}
      className="z-5 h-full min-h-96 w-full rounded-sm focus-visible:outline-none [&_.leaflet-control-attribution]:hidden"
    >
      <MapTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className={cn('grayscale', resolvedTheme === 'dark' && 'brightness-50')}
      />

      {/* Route Polyline */}
      {polyline && (
        <MapFeatureGroup name="polyline">
          <MapPolyline positions={polyline} />
        </MapFeatureGroup>
      )}

      {/* Driver Marker */}
      {data?.last_delivery_latitude &&
        data?.last_delivery_longitude &&
        data?.type !== OrderTypes.TAKEOUT &&
        !isFinished && (
          <MapMarker
            position={DRIVER_LOCATION}
            icon={
              <span
                className="relative flex h-6 w-6 items-center justify-center"
                style={
                  {
                    '--driver-vehicle-color': lastDelivery?.driver_vehicle_color || 'blue',
                    '--driver-vehicle-opacity': 'rgb(from var(--driver-vehicle-color) r g b / 0.5)',
                  } as React.CSSProperties
                }
              >
                <span className="absolute h-8 w-8 animate-ping rounded-full bg-driver-vehicle-opacity" />
                <span className="absolute h-8 w-8 animate-pulse rounded-full bg-driver-vehicle-opacity" />
                <span className="border-background absolute h-4 w-4 rounded-full border-2 bg-driver-vehicle-color" />
              </span>
            }
          />
        )}

      {/* Store Marker */}
      <MapMarker
        className="customer-marker"
        position={STORE_LOCATION}
        icon={
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="bg-foreground/25 absolute h-6 w-6 rounded-full" />
            <span className="bg-foreground/50 absolute h-4 w-4 rounded-full" />
            <span className="bg-foreground absolute h-2 w-2 rounded-full" />
            <Badge className="bg-foreground text-background absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
              {data?.type === OrderTypes.TAKEOUT ? 'local de retirada' : 'partida'}
            </Badge>
          </span>
        }
      />

      {/* Customer Marker */}
      {data?.type !== OrderTypes.TAKEOUT && (
        <MapMarker
          className="customer-marker"
          position={CUSTOMER_LOCATION}
          icon={
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="bg-foreground/25 absolute h-6 w-6 rounded-full" />
              <span className="bg-foreground/50 absolute h-4 w-4 rounded-full" />
              <span className="bg-foreground absolute h-2 w-2 rounded-full" />
              <Badge className="bg-foreground text-background absolute -top-7 left-1/2 -translate-x-1/2">destino</Badge>
            </span>
          }
        />
      )}

      {successfulEventDistance ? (
        <MapCircle
          center={CUSTOMER_LOCATION}
          radius={successfulEventDistance}
          className="fill-foreground stroke-foreground stroke-2"
        />
      ) : null}

      {/* Events Marker */}
      {events?.map((event) => (
        <MapMarker
          key={event.id}
          className="event-marker"
          position={[Number(event.latitude ?? 0), Number(event.longitude ?? 0)]}
          icon={
            <span
              style={
                {
                  '--event-color': OrderStatusColors[event.status as keyof typeof OrderStatusColors],
                } as React.CSSProperties
              }
              className={cn(
                'group relative flex h-6 w-6 items-center justify-center',
                !eventsToShow.get(event.id)?.show && 'hidden',
              )}
            >
              <span className="absolute h-6 w-6 rounded-full bg-(--event-color) opacity-25" />
              <span className="absolute h-4 w-4 rounded-full bg-(--event-color) opacity-50" />
              <span className="absolute h-2 w-2 rounded-full bg-(--event-color)" />
              <div className="bg-foreground absolute -top-9 left-1/2 hidden -translate-x-1/2 rounded-sm p-1 transition-opacity group-hover:block">
                <OrderStatusBadge variant={event.status as OrderStatus}>{event.status}</OrderStatusBadge>
              </div>
            </span>
          }
        />
      ))}

      <Button
        className="leaflet-top leaflet-left pointer-events-auto! absolute left-2! top-2! rounded-full"
        onClick={() => (allEventsVisible ? handleToggleAllEvents(false) : handleToggleAllEvents(true))}
      >
        {allEventsVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </Button>

      <div className="leaflet-bottom leaflet-left absolute bottom-2! left-2! flex flex-col gap-y-2">
        {polyline ? <Badge className="bg-foreground text-background w-fit">Rota sugerida</Badge> : null}
        {successfulEventDistance ? (
          <Badge className="w-fit bg-green-800 text-white">
            {`Apontamento de sucesso: ${
              successfulEventDistance > 1000
                ? `${(successfulEventDistance / 1000).toFixed(2)} km`
                : `${successfulEventDistance} m`
            }`}
          </Badge>
        ) : null}
      </div>
    </MapComponent>
  );
};

const DriverCard = ({ data, isLoading }: { data?: Order; isLoading: boolean }) => {
  const lastDelivery = data?.deliveries
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .at(-1);

  return isLoading ? (
    <Skeleton className="flex h-28 w-full rounded-sm" />
  ) : (
    <div className="flex h-28 w-full justify-between gap-x-4 rounded-sm border p-2">
      <div className="flex items-center gap-x-4">
        <Avatar className="aspect-auto h-full w-auto rounded-sm">
          <AvatarImage src={lastDelivery?.driver_image_url} />
          <AvatarFallback className="aspect-square rounded-sm">
            <ImageOff className="text-muted-foreground h-4 w-4" />
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <div className="flex items-center gap-x-2">
            <span className="text-muted-foreground whitespace-nowrap">Transportadora:</span>
            <div className="flex items-center gap-x-2">
              <CarrierAvatar carrier_name={data?.last_delivery_type || ''} />
              <span className="whitespace-nowrap">{data?.last_delivery_type}</span>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-muted-foreground whitespace-nowrap">Motorista:</span>
            <span>{lastDelivery?.driver_name || '-'}</span>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-muted-foreground whitespace-nowrap">Documento:</span>{' '}
            <span>{lastDelivery?.driver_document || '-'}</span>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="text-muted-foreground whitespace-nowrap">Telefone:</span>{' '}
            <span>{lastDelivery?.driver_phone || '-'}</span>
          </div>
        </div>
      </div>

      <div>
        {lastDelivery?.driver_vehicle_type ? <div>{lastDelivery?.driver_vehicle_type}</div> : null}

        {lastDelivery?.driver_vehicle_plate ? (
          <div className="bg-muted rounded-sm p-2">{lastDelivery?.driver_vehicle_plate}</div>
        ) : null}
      </div>
    </div>
  );
};

const PromisedDeliveryDate = ({ data, isLoading = false }: { data?: Order; isLoading?: boolean }) => {
  let otd_situation = 'unknown';
  if (data?.type === OrderTypes.TAKEOUT) {
    otd_situation = 'takeout';
  } else if (data?.status_name === OrderStatus.SUCCESSFUL) {
    if (data?.last_delivery_delivered_date && data?.expected_customer_shipping_date) {
      if (new Date(data?.last_delivery_delivered_date) > new Date(data?.expected_customer_shipping_date)) {
        otd_situation = 'late_finished';
      } else {
        otd_situation = 'on_time_finished';
      }
    }
  } else {
    if (data?.expected_customer_shipping_date) {
      if (new Date() > new Date(data?.expected_customer_shipping_date)) {
        otd_situation = 'late_unfinished';
      } else {
        otd_situation = 'on_time_unfinished';
      }
    }
  }

  const title = {
    on_time_finished: 'Pedido entregue no prazo',
    on_time_unfinished: 'Este pedido está dentro do prazo',
    late_finished: 'Pedido entregue com atraso',
    late_unfinished: 'Este pedido está atrasado',
    unknown: 'Prazo prometido ao cliente não informado',
    takeout: 'Pedido para retirada em loja',
  };

  const lastDelivery = data?.deliveries
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .at(-1);

  const isOnTime = ['on_time_finished', 'on_time_unfinished'].includes(otd_situation);
  const isLate = ['late_finished', 'late_unfinished'].includes(otd_situation);

  const isFinished = ['on_time_finished', 'late_finished'].includes(otd_situation);
  const isNotFinished = ['on_time_unfinished', 'late_unfinished'].includes(otd_situation);

  return isLoading ? (
    <Skeleton className="flex h-28 w-full flex-col items-center justify-center gap-y-4" />
  ) : (
    <Alert
      variant={isOnTime ? 'success' : isLate ? 'destructive' : 'neutral'}
      className={cn(isNotFinished && 'border-dashed')}
    >
      {isOnTime && isNotFinished && <ThumbsUp className="h-4 w-4" />}
      {isOnTime && isFinished && <BadgeCheck className="h-4 w-4" />}
      {isLate && isNotFinished && <ThumbsDown className="h-4 w-4" />}
      {isLate && isFinished && <BadgeX className="h-4 w-4" />}
      {otd_situation === 'unknown' && <BadgeAlert className="h-4 w-4" />}

      <AlertTitle>{title[otd_situation as keyof typeof title]}</AlertTitle>
      <AlertDescription>
        <div className="flex gap-x-1">
          {data?.expected_customer_shipping_date ? (
            <React.Fragment>
              <span>
                &bull; {isNotFinished ? 'O cliente espera receber ' : 'O cliente esperava receber '}
                {formatRelative(new Date(data?.expected_customer_shipping_date || ''), new Date(), {
                  locale: ptBR,
                })}
              </span>
              {isNotFinished ? (
                <span className="font-medium">
                  (
                  {formatDistanceToNow(new Date(data?.expected_customer_shipping_date || ''), {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                  )
                </span>
              ) : null}
            </React.Fragment>
          ) : (
            <span>&bull; Prazo de entrega prometido ao cliente não informado</span>
          )}
        </div>

        <div className="flex gap-x-1">
          {lastDelivery?.eta && !data?.last_delivery_delivered_date ? (
            <React.Fragment>
              <span>
                &bull;
                {` O prazo informado pela transportadora é ${formatRelative(
                  new Date(lastDelivery?.eta || ''),
                  new Date(),
                  {
                    locale: ptBR,
                  },
                )}`}
              </span>
              <span className="font-medium">
                {` (${formatDistanceToNow(new Date(lastDelivery?.eta || ''), {
                  locale: ptBR,
                  addSuffix: true,
                })})`}
              </span>
            </React.Fragment>
          ) : data?.last_delivery_delivered_date ? (
            <div className="flex flex-wrap gap-x-1">
              <span>
                &bull;{' '}
                {` O pedido foi entregue ${formatRelative(
                  new Date(data?.last_delivery_delivered_date || ''),
                  new Date(),
                  {
                    locale: ptBR,
                  },
                )}`}
              </span>
              {data?.expected_customer_shipping_date ? (
                <span className="font-medium">
                  {` (${formatDistance(
                    new Date(data?.expected_customer_shipping_date || ''),
                    new Date(data?.last_delivery_delivered_date || ''),
                    {
                      locale: ptBR,
                    },
                  )} ${
                    new Date(data?.expected_customer_shipping_date || '').getTime() >=
                    new Date(data?.last_delivery_delivered_date || '').getTime()
                      ? 'antes do'
                      : 'após o'
                  } prazo)`}
                </span>
              ) : null}
            </div>
          ) : (
            <span>&bull; Prazo não informado pela transportadora</span>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

const OrderTimetrack = ({ data, isLoading = false }: { data?: Order; isLoading?: boolean }) => {
  const diffInMinutes = (start: string | Date | null, end: string | Date | null) => {
    if (!start || !end) return null;
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
    return Math.round(diffMs / 60000); // convert ms → minutes
  };

  const processedToCreated = diffInMinutes(data?.seller_processed_at || null, data?.created_at || null) || 0;
  const createdToDeliveredOrNow =
    diffInMinutes(data?.created_at || null, data?.last_delivery_delivered_date || new Date().toISOString()) || 0;

  const chartData = [
    {
      id: 'pick-and-packing',
      type: 'pick-and-packing',
      label: 'Preparo',
      value: processedToCreated,
      color: '#3b82f6',
    },
    {
      id: 'shipping',
      type: 'shipping',
      label: data?.type === OrderTypes.TAKEOUT ? 'Retirada' : 'Entrega',
      value: createdToDeliveredOrNow,
      color: '#10b981',
    },
  ];

  const total = processedToCreated + createdToDeliveredOrNow;

  const formatPercentage = React.useCallback(
    (value: number) => {
      if (!total) {
        return '0.00';
      }

      return ((value / total) * 100).toFixed(2);
    },
    [total],
  );

  return isLoading ? (
    <Skeleton className="flex h-28 w-full flex-col items-center justify-center gap-y-4" />
  ) : (
    <div className="flex flex-col items-center gap-y-3 rounded-sm border p-4">
      <div className="flex w-full items-end justify-between gap-x-2">
        <span
          className={cn(
            'bg-muted whitespace-nowrap rounded-sm px-1 text-blue-500',
            !data?.seller_processed_at && 'text-muted',
          )}
        >
          {data?.seller_processed_at ? formatTime(data?.seller_processed_at, 'dd/MM/yy HH:mm:ss') : '--/--/-- --:--:--'}
        </span>

        <span className="mb-1 h-px w-full border-b border-dashed" />
        <span className={cn('bg-muted whitespace-nowrap rounded-sm px-1 text-yellow-500')}>
          {formatTime(data?.created_at, 'dd/MM/yy HH:mm:ss')}
        </span>
        <span className="mb-1 h-px w-full border-b border-dashed" />

        <span
          className={cn(
            'bg-muted whitespace-nowrap rounded-sm px-1 text-emerald-500',
            !data?.last_delivery_delivered_date && 'text-muted animate-pulse',
          )}
        >
          {data?.last_delivery_delivered_date
            ? formatTime(data?.last_delivery_delivered_date, 'dd/MM/yy HH:mm:ss')
            : '--/--/-- --:--:--'}
        </span>
      </div>
      {/* Chart */}
      <div className="flex h-5 w-full gap-x-1 overflow-hidden">
        {chartData
          .filter((cd) => cd.value > 0)
          .map((cd, idx) => (
            <div
              key={idx}
              className={cn(
                'w-(--bar-width) rounded-sm bg-(--bar-bg)',
                !data?.last_delivery_delivered_date && cd.id === 'shipping' && 'animate-pulse',
              )}
              style={
                {
                  '--bar-bg': cd.color,
                  '--bar-width': `${formatPercentage(cd.value)}%`,
                } as React.CSSProperties
              }
            />
          ))}
      </div>
      {/* Legenda */}
      <div className="flex w-full items-center justify-between gap-x-6">
        {chartData.map((cd, idx) => (
          <div key={idx} className="flex items-center gap-x-2 text-sm">
            <span
              className={cn(
                'h-3 w-3 rounded-xs bg-(--color)',
                !data?.last_delivery_delivered_date && cd.id === 'shipping' && 'animate-pulse',
              )}
              style={
                {
                  '--color': cd.color,
                } as React.CSSProperties
              }
            />
            <div className="flex items-center gap-x-2">
              <span className="text-muted-foreground">{`${cd.label}: `}</span>
              <div className="flex items-center gap-x-1">
                <span className="font-medium tabular-nums">{formatPercentage(cd.value)}%</span>
                <span className="text-muted-foreground flex items-center tabular-nums">
                  ({minutesToHour(cd.value || 0)})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DeliveriesHistory = ({
  data,
  isLoading = false,
  handleToggleEvent,
  eventsToShow,
}: {
  data?: Order;
  isLoading?: boolean;
  handleToggleEvent: (eventId: string) => void;
  eventsToShow: Map<string, DeliveryEvent & { show: boolean }>;
}) => {
  const [openAttachmentsDialog, setOpenAttachmentsDialog] = React.useState(false);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [hasMoreBelow, setHasMoreBelow] = React.useState(false);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
      setHasMoreBelow(container.scrollHeight - container.scrollTop - container.clientHeight > 10);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // created and manual handle
  const eventsWithoutDelivery = data?.delivery_events.filter((event) => !event.delivery_id) || [];
  const deliveries = data?.deliveries || [];

  const sortedSingleEventsAndDeliveries = [...eventsWithoutDelivery, ...deliveries].sort(
    (a, b) =>
      new Date('event_at' in b ? b.event_at : b.created_at).getTime() -
      new Date('event_at' in a ? a.event_at : a.created_at).getTime(),
  );

  const lastDelivery = data?.deliveries
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .at(-1);

  return isLoading ? (
    <Skeleton className="flex h-full w-full flex-col items-center justify-center gap-y-4 text-center" />
  ) : (
    <div className="relative flex h-full min-h-0 flex-col gap-y-2 rounded-sm border">
      {/* Scroll indicators */}
      <div className={cn('absolute inset-x-0 top-0 flex justify-center')}>
        <div
          className={cn(
            'text-muted bg-foreground items-center justify-center rounded-full p-1 transition-opacity',
            scrollTop > 0 ? 'opacity-100' : 'opacity-0',
          )}
        >
          <ChevronUp className="h-3 w-3" />
        </div>
      </div>

      <div className="flex flex-col gap-y-4 overflow-y-auto p-4" ref={scrollContainerRef}>
        {sortedSingleEventsAndDeliveries.map((deliveryOrEvent) =>
          'event_at' in deliveryOrEvent ? (
            <DeliveryEventTimeline
              key={deliveryOrEvent.id}
              data={deliveryOrEvent as DeliveryEvent}
              isLoading={isLoading}
              setOpenAttachmentsDialog={setOpenAttachmentsDialog}
            />
          ) : (
            <DeliveryTimeline
              key={deliveryOrEvent.id}
              data={deliveryOrEvent as Delivery}
              isLoading={isLoading}
              handleToggleEvent={handleToggleEvent}
              eventsToShow={eventsToShow}
              setOpenAttachmentsDialog={setOpenAttachmentsDialog}
              defaultOpen={lastDelivery?.id === deliveryOrEvent.id}
            />
          ),
        )}
      </div>

      {/* Scroll indicators */}
      <div className={cn('absolute inset-x-0 bottom-0 flex justify-center')}>
        <div
          className={cn(
            'text-muted bg-foreground items-center justify-center rounded-full p-1 transition-opacity',
            hasMoreBelow ? 'opacity-100' : 'opacity-0',
          )}
        >
          <ChevronDown className="h-3 w-3" />
        </div>
      </div>

      <OrderAttachmentsDialog open={openAttachmentsDialog} onOpenChange={setOpenAttachmentsDialog} data={data} />
    </div>
  );
};

const DeliveryEventTimeline = ({
  data,
  isLoading = false,
  setOpenAttachmentsDialog,
}: {
  data?: DeliveryEvent;
  isLoading?: boolean;
  setOpenAttachmentsDialog: (open: boolean) => void;
}) => {
  return isLoading || !data ? (
    <Skeleton className="flex h-80 w-full flex-1 flex-col items-center justify-center" />
  ) : (
    <div className="flex flex-col rounded-sm border px-6 py-4">
      <Timeline value={1}>
        <TimelineItem key={data.id} step={1}>
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:h-[calc(100%-2.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-8" />
            <TimelineDate className="flex justify-between">
              {formatTime(data.event_at, 'dd/MM/yy HH:mm:ss')}

              <Tooltip>
                <TooltipTrigger>
                  {data?.manual_action ? (
                    <MousePointerClick className="text-muted-foreground h-4 w-4" />
                  ) : (
                    <LinkIcon className="text-muted-foreground h-4 w-4" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {data?.user?.email ? (
                    <>
                      Ação realizada por <strong>{data?.user?.email}</strong>
                    </>
                  ) : data?.manual_action ? (
                    'Ação manual'
                  ) : (
                    'Ação automática'
                  )}
                </TooltipContent>
              </Tooltip>
            </TimelineDate>
            <TimelineTitle className="mb-2 w-full">
              <span className="flex items-center gap-x-1">
                <OrderStatusBadge variant={data.status as OrderStatus}>{data.status}</OrderStatusBadge>
                {data.sub_status && (
                  <span className="text-muted-foreground font-normal">{` - ${data.sub_status}`}</span>
                )}
              </span>
            </TimelineTitle>
            <TimelineIndicator
              className={cn(
                'flex h-8 w-8 items-center justify-center',
                data.latitude &&
                  data.longitude &&
                  'group-data-completed/timeline-item:border-foreground group-data-completed/timeline-item:bg-foreground cursor-pointer',
                !data.latitude &&
                  !data.longitude &&
                  'bg-muted group-data-completed/timeline-item:border-muted border-red-500',
              )}
            />
          </TimelineHeader>
          <div className="flex flex-col gap-y-2">
            {data?.driver_name || data?.driver_document || data?.driver_phone ? (
              <div>
                {data?.driver_name ? <strong>{data.driver_name}</strong> : null}
                {data?.driver_document ? (
                  <div>
                    <span>Documento: </span>
                    {data.driver_document}
                  </div>
                ) : null}
                {data?.driver_phone ? (
                  <div>
                    <span>Telefone: </span>
                    {data.driver_phone}
                  </div>
                ) : null}
              </div>
            ) : null}

            {data.observation && (
              <div className="text-muted-foreground rounded-sm border px-2 py-1 text-sm">{data.observation}</div>
            )}
            {data?.attachments.length > 0 && (
              <div className="grid w-full grid-cols-5 gap-2">
                {data?.attachments.map((attachment) => (
                  <Tooltip key={attachment.id}>
                    <TooltipTrigger
                      render={
                        <div
                          className="cursor-pointer rounded-sm border p-2"
                          onClick={() => setOpenAttachmentsDialog(true)}
                        />
                      }
                    >
                      <img
                        className="w-full"
                        src={attachment?.url}
                        alt={attachment?.created_at}
                        width={100}
                        height={200}
                      />
                    </TooltipTrigger>
                    {attachment.user_id ? (
                      <TooltipContent>
                        Anexado por <strong>{attachment?.user?.email as string}</strong> em{' '}
                        {formatTime(attachment?.created_at, 'dd/MM/yy HH:mm:ss')}
                      </TooltipContent>
                    ) : null}
                  </Tooltip>
                ))}
              </div>
            )}
          </div>
        </TimelineItem>
      </Timeline>
    </div>
  );
};

const DeliveryTimeline = ({
  data,
  isLoading = false,
  handleToggleEvent,
  eventsToShow,
  setOpenAttachmentsDialog,
  defaultOpen,
}: {
  data?: Delivery;
  isLoading?: boolean;
  handleToggleEvent: (eventId: string) => void;
  eventsToShow: Map<string, DeliveryEvent & { show: boolean }>;
  setOpenAttachmentsDialog: (open: boolean) => void;
  defaultOpen: boolean;
}) => {
  return isLoading ? (
    <Skeleton className="flex h-80 w-full flex-1 flex-col items-center justify-center" />
  ) : (
    <Accordion defaultValue={defaultOpen ? ['delivery'] : []} className="rounded-sm border px-4">
      <AccordionItem value="delivery" className="border-none">
        <AccordionTrigger className="hover:no-underline">
          <div className="grid w-full grid-cols-[auto_1fr] items-center gap-x-2">
            <CarrierAvatar carrier_name={data?.carrier_type || ''} className="h-8 w-8" />
            <div className="flex gap-x-1">
              <time className="text-muted-foreground mb-1 font-medium">
                {formatTime(data?.created_at, 'dd/MM/yy HH:mm:ss')}
              </time>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col p-2">
          <Timeline value={data?.events.length}>
            {data?.events
              .sort((a, b) => new Date(b.event_at).getTime() - new Date(a.event_at).getTime())
              .map((event, index) => (
                <TimelineItem
                  key={event.id}
                  step={index + 1}
                  className="group-data-[orientation=vertical]/timeline:pb-4"
                >
                  <TimelineHeader>
                    <TimelineSeparator className="group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-8" />
                    <TimelineDate className="flex justify-between">
                      {formatTime(event.event_at, 'dd/MM/yy HH:mm:ss')}

                      <Tooltip>
                        <TooltipTrigger>
                          {event?.manual_action ? (
                            <MousePointerClick className="text-muted-foreground h-4 w-4" />
                          ) : (
                            <LinkIcon className="text-muted-foreground h-4 w-4" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {event?.user?.email ? (
                            <>
                              Ação realizada por
                              <strong>{event?.user?.email}</strong>
                            </>
                          ) : event?.manual_action ? (
                            'Ação manual'
                          ) : (
                            'Ação automática'
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TimelineDate>
                    <TimelineTitle className="my-2 w-full">
                      <span className="flex items-center gap-x-1">
                        <OrderStatusBadge variant={event.status as OrderStatus}>{event.status}</OrderStatusBadge>
                        {event.sub_status && (
                          <span className="text-muted-foreground font-normal">{` - ${event.sub_status}`}</span>
                        )}
                      </span>
                    </TimelineTitle>
                    <TimelineIndicator
                      className={cn(
                        'flex h-8 w-8 items-center justify-center',
                        event.latitude &&
                          event.longitude &&
                          'group-data-completed/timeline-item:border-foreground group-data-completed/timeline-item:bg-foreground cursor-pointer',
                        !event.latitude &&
                          !event.longitude &&
                          'bg-muted group-data-completed/timeline-item:border-muted pointer-events-none',
                      )}
                      onClick={() => handleToggleEvent(event.id)}
                    >
                      {eventsToShow.get(event.id)?.show ? (
                        <EyeOffIcon
                          className={cn(
                            'h-4 w-4',
                            !event.latitude && !event.longitude && 'text-muted-foreground',
                            event.latitude && event.longitude && 'text-background',
                          )}
                        />
                      ) : (
                        <EyeIcon
                          className={cn(
                            'h-4 w-4',
                            !event.latitude && !event.longitude && 'text-muted-foreground',
                            event.latitude && event.longitude && 'text-background',
                          )}
                        />
                      )}
                    </TimelineIndicator>
                  </TimelineHeader>
                  <div className="flex flex-col gap-y-2">
                    {event?.driver_name || event?.driver_document || event?.driver_phone ? (
                      <div>
                        {event?.driver_name ? <strong>{event.driver_name}</strong> : null}
                        {event?.driver_document ? (
                          <div>
                            <span>Documento: </span>
                            {event.driver_document}
                          </div>
                        ) : null}
                        {event?.driver_phone ? (
                          <div>
                            <span>Telefone: </span>
                            {event.driver_phone}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {event.observation && (
                      <div className="text-muted-foreground rounded-sm border px-2 py-1 text-sm">
                        {event.observation}
                      </div>
                    )}
                    {event?.attachments.length > 0 && (
                      <div className="grid w-full grid-cols-5 gap-2">
                        {event?.attachments.map((attachment) => (
                          <Tooltip key={attachment.id}>
                            <TooltipTrigger
                              render={
                                <div
                                  className="cursor-pointer rounded-sm border p-2"
                                  onClick={() => setOpenAttachmentsDialog(true)}
                                />
                              }
                            >
                              <img
                                className="w-full"
                                src={attachment?.url}
                                alt={attachment?.created_at}
                                width={100}
                                height={200}
                              />
                            </TooltipTrigger>

                            {attachment.user_id ? (
                              <TooltipContent>
                                Anexado por <strong>{attachment?.user?.email}</strong> em{' '}
                                {formatTime(attachment?.created_at, 'dd/MM/yy HH:mm:ss')}
                              </TooltipContent>
                            ) : null}
                          </Tooltip>
                        ))}
                      </div>
                    )}
                  </div>
                </TimelineItem>
              ))}
          </Timeline>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const CustomerCard = ({ data, isLoading = false }: { data?: Order; isLoading?: boolean }) => {
  const isTakeoutEditable =
    data?.type === OrderTypes.TAKEOUT &&
    data?.status_name === 'PENDING' &&
    data?.sub_status === 'WAITING_TAKEOUT_CONFIRMATION';

  const disabled = !(isTakeoutEditable || data?.is_routeable);
  console.log(disabled);
  return isLoading ? (
    <Skeleton className="flex h-fit min-h-32 w-full items-center justify-center" />
  ) : (
    <React.Fragment>
      <Alert className="relative h-fit min-h-32">
        <CircleUser className="h-4 w-4" />
        <AlertTitle>{data?.customer.name}</AlertTitle>
        <AlertDescription className="w-full">
          <div className="flex w-full gap-x-1">
            <span className="text-muted-foreground">Telefone: </span>
            <span>{data?.customer.phone || '---'}</span>
          </div>

          <div className="flex w-full gap-x-1">
            <span className="text-muted-foreground">Email: </span>
            <span>{data?.customer.email ? smartTrim(data?.customer.email || '', 40) : '---'}</span>
          </div>

          <div className="flex w-full gap-x-1">
            <span className="text-muted-foreground">Documento: </span>
            <span>
              {data?.customer.document_number || '---'}
              {data?.customer.document_number && ` (${data?.customer.document_type})`}
            </span>
          </div>
        </AlertDescription>

        <Tooltip>
          <TooltipTrigger
            render={
              <div
                data-disabled={disabled}
                className="hover:bg-muted absolute right-4 top-4 w-fit min-w-fit max-w-fit cursor-pointer rounded-sm p-2 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
              />
            }
          >
            <Pencil className="h-4 w-4" />
          </TooltipTrigger>
          {disabled ? (
            <TooltipContent side="left" className="max-w-[300px]">
              Não é possível editar o cliente
            </TooltipContent>
          ) : null}
        </Tooltip>
      </Alert>
    </React.Fragment>
  );
};

const AddressCard = ({ data, isLoading = false }: { data?: Order; isLoading?: boolean }) => {
  const disabled = !data?.is_routeable;

  return isLoading ? (
    <Skeleton className="flex h-fit min-h-28 w-full items-center justify-center" />
  ) : (
    <React.Fragment>
      <Alert className="relative h-fit min-h-28 pr-10">
        <MapPinHouse className="h-4 w-4" />

        <AlertTitle>
          {data?.destination_address.street}, {data?.destination_address.street_number}
        </AlertTitle>
        <AlertDescription className="w-full">
          <div className="flex w-full gap-x-1">
            <span>
              {data?.destination_address.complement}, {data?.destination_address.neighborhood},{' '}
              {data?.destination_address.city}, {data?.destination_address.state} - {data?.destination_address.zip_code}
            </span>
          </div>

          <span className="text-muted-foreground">
            Ponto de referência: {data?.destination_address.reference || '---'}
          </span>
        </AlertDescription>

        <Tooltip>
          <TooltipTrigger>
            <div
              data-disabled={disabled}
              className="hover:bg-muted absolute right-4 top-4 w-fit min-w-fit max-w-fit cursor-pointer rounded-sm p-2 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
            >
              <Pencil className="h-4 w-4" />
            </div>
          </TooltipTrigger>
          {disabled ? (
            <TooltipContent side="left" className="max-w-[300px]">
              Não é possível editar o endereço
            </TooltipContent>
          ) : null}
        </Tooltip>

        <a
          href={`https://maps.google.com/?q=${data?.destination_address.latitude},${data?.destination_address.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-muted absolute bottom-4 right-4 w-fit min-w-fit max-w-fit cursor-pointer rounded-sm p-2"
        >
          <ArrowUpRight className="h-4 w-4 pl-0" />
        </a>
      </Alert>
    </React.Fragment>
  );
};

const CsatAlert = ({ data, isLoading = false }: { data?: Order; isLoading?: boolean }) => {
  const isPromoter = data?.nps.some((nps) => nps?.response_2 >= 9);
  const isPassive = data?.nps.some((nps) => nps?.response_2 >= 7 && nps?.response_2 <= 8);
  const isDetractor = data?.nps.some((nps) => nps?.response_2 <= 6);

  return isLoading ? (
    <Skeleton className="flex h-fit min-h-20 w-full flex-col items-center justify-center gap-y-4" />
  ) : (
    <Alert variant={isPromoter ? 'success' : isPassive ? 'warning' : isDetractor ? 'destructive' : 'neutral'}>
      <Star className="h-4 w-4" />
      <AlertTitle>
        {data?.nps[0]?.response_2
          ? `O cliente avaliou com nota ${data?.nps[0]?.response_2}`
          : 'Pedido não avaliado pelo cliente'}
      </AlertTitle>
      {data?.nps[0]?.response_3 ? <AlertDescription>{`"${data?.nps[0]?.response_3}"`}</AlertDescription> : null}
    </Alert>
  );
};

const ReceiverAlert = ({ data, isLoading = false }: { data?: Order; isLoading?: boolean }) => {
  const receiver = data?.delivery_events.filter((event) => event?.status === OrderStatus.SUCCESSFUL)?.at(0)?.receiver;

  return isLoading ? (
    <Skeleton className="flex h-fit min-h-16 w-full flex-col items-center justify-center gap-y-4" />
  ) : data?.status_name === OrderStatus.SUCCESSFUL ? (
    <Alert variant="warning">
      <CircleUser className="h-4 w-4" />
      <AlertTitle>
        {receiver
          ? `O pedido foi ${data.type === OrderTypes.TAKEOUT ? 'retirado por' : 'entregue para'} ${receiver.name}`
          : 'Não foi possível identificar o recebedor do pedido'}
      </AlertTitle>
      {receiver?.description || receiver?.document_number ? (
        <AlertDescription>
          {receiver?.description ? `${receiver?.description}` : ''}
          {receiver?.document_number ? `Documento: ${receiver?.document_number}` : ''}
        </AlertDescription>
      ) : null}
    </Alert>
  ) : null;
};

const FreightRevenue = ({ data, isLoading = false }: { data?: Order; isLoading?: boolean }) => {
  const customerPaid = data?.expected_customer_shipping_price || 0;
  const estimatedFreight =
    data?.deliveries.reduce((acc, delivery) => acc + (delivery?.expected_delivery_price || 0), 0) || 0;
  const freightCost =
    data?.deliveries.reduce((acc, delivery) => acc + (delivery?.delivered_delivery_price || 0), 0) || 0;

  const isProfit = customerPaid >= freightCost;
  const isLoss = customerPaid < freightCost;

  return isLoading ? (
    <Skeleton className="flex h-fit min-h-44 w-full flex-col items-center justify-center gap-y-4" />
  ) : (
    <Alert variant={isProfit ? 'success' : isLoss ? 'destructive' : 'neutral'}>
      {isProfit && <BanknoteArrowUp className="h-4 w-4" />}
      {isLoss && <BanknoteArrowDown className="h-4 w-4" />}

      {
        <AlertTitle>
          Você {isProfit ? 'teve uma economia de ' : isLoss ? 'teve uma despesa de ' : 'faturou '}
          {Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(Math.abs(customerPaid - freightCost) / 100)}{' '}
          no frete desse pedido
        </AlertTitle>
      }
      <AlertDescription>
        <div className="flex w-full gap-x-1">
          <span>
            &bull;{' '}
            {data?.expected_customer_shipping_price == null
              ? 'O valor pago pelo cliente não foi informado'
              : `O cliente pagou ${Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(customerPaid / 100)} pelo frete`}
          </span>
        </div>
        <div className="flex w-full gap-x-1">
          <span>
            &bull;{' '}
            {estimatedFreight
              ? `Os fretes tabelados estimaram um custo de ${Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(estimatedFreight / 100)}`
              : 'Nenhuma tabela de frete foi cadastrada'}
          </span>
        </div>
        <div className="flex w-full gap-x-1">
          <span>
            &bull;{' '}
            {freightCost
              ? `Foi informado pelas transportadoras um gasto total de ${Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(freightCost / 100)} no frete desse pedido`
              : 'As transportadoras não informaram o valor do frete'}
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
};

const VerificationCodesAlert = ({ data, isLoading = false }: { data?: Order; isLoading?: boolean }) => {
  const lastDelivery = data?.deliveries
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .at(-1);

  const returnVerificationCode = lastDelivery?.return_verification_code;
  const collectVerificationCode = lastDelivery?.collect_verification_code;

  return isLoading ? (
    <div className="flex flex-col gap-y-4">
      <Skeleton className="flex h-fit min-h-32 w-full flex-col items-center justify-center gap-y-4" />
      <Skeleton className="flex h-fit min-h-32 w-full flex-col items-center justify-center gap-y-4" />
    </div>
  ) : (
    <div className="flex flex-col gap-y-4">
      <Alert variant={collectVerificationCode ? 'info' : 'neutral'}>
        <SquareAsterisk className="h-4 w-4" />
        <AlertTitle>Código de verificação de coleta</AlertTitle>
        <AlertDescription>
          {collectVerificationCode
            ? `Informe ao entregador o código ${collectVerificationCode}`
            : 'Desabilitado para este envio'}
        </AlertDescription>
      </Alert>

      <Alert variant={returnVerificationCode ? 'info' : 'neutral'}>
        <SquareAsterisk className="h-4 w-4" />
        <AlertTitle>Código de Verificação de Retorno</AlertTitle>
        <AlertDescription>
          {returnVerificationCode
            ? `Informe ao entregador o código ${returnVerificationCode}`
            : 'Desabilitado para este envio'}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export { ViewOrderPage };
