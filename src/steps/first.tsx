import { useState } from "react";

import {
  ImageIcon,
  UploadIcon,
  CrossCircledIcon,
  Cross1Icon,
  CheckIcon,
} from "@modulz/radix-icons";
import { IconProps } from "@modulz/radix-icons/dist/types";
import { Group, MantineTheme, Text, useMantineTheme } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, DropzoneStatus } from "@mantine/dropzone";
import { FileError } from "react-dropzone";
import { useNotifications } from "@mantine/notifications";

function ImageUploadIcon({
  status,
  ...props
}: { status: DropzoneStatus } & IconProps) {
  if (status.accepted) {
    return <UploadIcon {...props} />;
  }

  if (status.rejected) {
    return <CrossCircledIcon {...props} />;
  }

  return <ImageIcon {...props} />;
}

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.black;
}

export default function FirstStep() {
  const theme = useMantineTheme();
  const notifications = useNotifications();

  return (
    <div>
      <p>Upload a picture of the bill</p>
      <Dropzone
        onDrop={(files) => {
          console.log("accepted file", files[0]);
          notifications.clean();
          notifications.showNotification({
            title: "File accepted",
            message: `Selected file ${files[0].name}`,
            color: "teal",
            icon: <CheckIcon />,
          });
        }}
        onReject={(files) => {
          console.log("rejected file", files[0]);
          notifications.clean();
          files[0].errors.forEach((error) => {
            notifications.showNotification({
              title: error.code,
              message: error.message,
              color: "red",
              icon: <Cross1Icon />,
            });
          });
        }}
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
      >
        {(status) => (
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <ImageUploadIcon
              status={status}
              style={{
                width: 80,
                height: 80,
                color: getIconColor(status, theme),
              }}
            />

            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed
                5mb
              </Text>
            </div>
          </Group>
        )}
      </Dropzone>
    </div>
  );
}
