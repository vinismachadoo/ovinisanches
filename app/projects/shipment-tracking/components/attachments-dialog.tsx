import { Order } from "@/app/projects/shipment-tracking/data/order"
import {
  OrderStatus,
  OrderStatusBadge,
} from "@/components/_backups/order-status-badge"
import { Card, CardContent } from "@/registry/default/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/default/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/registry/default/ui/dialog"
import { formatTime } from "@/lib/times"
import * as React from "react"

const OrderAttachmentsDialog = ({
  open,
  onOpenChange,
  data,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: Order
}) => {
  const attachmentsWithStatus = React.useMemo(() => {
    if (!data?.delivery_events) return []

    return data.delivery_events
      .filter((event) => event.attachments && event.attachments.length > 0)
      .flatMap((event) =>
        event.attachments.map((attachment) => ({
          ...attachment,
          status: event.status,
          sub_status: event.sub_status,
          event_at: event.event_at,
        }))
      )
  }, [data?.delivery_events])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle>Comprovantes</DialogTitle>
        </DialogHeader>
        <div className="grid min-w-0 px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {attachmentsWithStatus.map((attachment, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full p-0">
                    <CardContent className="flex h-full flex-col items-center justify-between gap-y-2 p-2">
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={attachment.url}
                          alt={`Attachment for ${attachment.status}`}
                          className="h-auto w-full rounded-sm border transition-opacity hover:opacity-80"
                        />
                      </a>
                      <div className="flex w-full flex-col gap-y-2">
                        <div className="flex items-center gap-x-1 whitespace-nowrap">
                          <OrderStatusBadge
                            variant={attachment.status as OrderStatus}
                          >
                            {attachment.status}
                          </OrderStatusBadge>
                          {attachment.sub_status && (
                            <span>{`- ${attachment.sub_status}`}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-x-1">
                          <span className="whitespace-nowrap text-muted-foreground">
                            Anexado em:
                          </span>
                          <span className="whitespace-nowrap">
                            {formatTime(
                              attachment.event_at,
                              "dd/MM/yyyy HH:mm:ss"
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrderAttachmentsDialog
