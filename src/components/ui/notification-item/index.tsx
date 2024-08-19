import { Accordion, AccordionDetails, AccordionSummary, Chip, Stack, Typography } from "@mui/material";
import { Notification } from "../../hooks/use-notifications";
import { ArrowDownward, ExpandMore } from "@mui/icons-material";
import { format } from "date-fns";

export type NotificationItemProps = {
  notification: Notification;
  id: number;
};

function NotificationItem({ notification, id }: NotificationItemProps) {
  return (
    <Accordion key={`notification-${id}`}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={`notification-${id}-body`}
        id={`notification-${id}-title`}
        sx={{ backgroundColor: "#F5F5F5" }}
      >
        <Stack direction="row" gap={1} alignItems="center">
          <ArrowDownward color="success" />
          <Chip label={notification.topic} color="default" />
          <Typography align="left" fontWeight="medium" sx={{ minWidth: "70%" }}>
            {notification.title}
          </Typography>
          <Typography align="right" fontSize="small" sx={{ minWidth: "30%" }} fontWeight="light">
            {format(notification.timestamp, "h:mm:ss a")}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {notification.body}
      </AccordionDetails>
    </Accordion>
  );
}

export default NotificationItem;