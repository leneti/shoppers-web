import React, { useState, useCallback } from "react";

import {
  ImageIcon,
  UploadIcon,
  CrossCircledIcon,
  Cross1Icon,
  CheckIcon,
} from "@modulz/radix-icons";
import { IconProps } from "@modulz/radix-icons/dist/types";
import {
  Group,
  MantineTheme,
  Text,
  useMantineTheme,
  Image,
  Button,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, DropzoneStatus } from "@mantine/dropzone";
import { FileRejection } from "react-dropzone";
import { useNotifications } from "@mantine/notifications";
import { uploadFromBlobAsync } from "../api/Storage";
import { Player } from "@lottiefiles/react-lottie-player";

import UploadingIcon from "../components/lottie/uploading.json";

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

export default function FirstStep({
  nextStep,
  prevStep,
  setUrlAndPath,
  setImageGlobal,
}: {
  nextStep: () => void;
  prevStep: () => void;
  setUrlAndPath: React.Dispatch<
    React.SetStateAction<{ url: string; path: string }>
  >;
  setImageGlobal: React.Dispatch<React.SetStateAction<File | undefined>>;
}) {
  const theme = useMantineTheme();
  const notifications = useNotifications();

  const [image, setImage] = useState<File>();
  const [isUploading, setisUploading] = useState(false);

  const acceptFiles = useCallback((files: File[]) => {
    const file = files?.[0];
    console.log("accepted file", file);

    setImage(file);
    setImageGlobal(file);

    notifications.clean();
    notifications.showNotification({
      title: "File accepted",
      message: `Selected file ${file.name}`,
      color: "teal",
      icon: <CheckIcon />,
    });
  }, []);

  const rejectFiles = useCallback((files: FileRejection[]) => {
    const file = files?.[0];
    console.log("rejected file", file);
    notifications.clean();
    file.errors.forEach((error) => {
      notifications.showNotification({
        title: error.code,
        message: error.message,
        color: "red",
        icon: <Cross1Icon />,
      });
    });
  }, []);

  const tryUploadImage = async () => {
    if (!image) {
      notifications.showNotification({
        title: "No image selected",
        message: "Please upload an image of the bill to be parsed",
        color: "red",
        icon: <Cross1Icon />,
      });
      return;
    }

    setisUploading(true);
    console.log("Uploading image to storage...");

    try {
      const { url, path } = await uploadFromBlobAsync(
        URL.createObjectURL(image),
        image.name
      );
      console.log(`${path} uploaded`);
      setUrlAndPath({ url, path });
    } catch (_) {
      setisUploading(false);
      notifications.showNotification({
        title: "Upload failed",
        message:
          "Could not upload the image to the database at this moment. Try again later",
        color: "red",
        icon: <Cross1Icon />,
      });
    }

    setisUploading(false);
    setTimeout(() => nextStep(), 500);
  };

  const tryAgain = () => {
    setImage(undefined);
    prevStep();
  };

  return (
    <Box>
      <p>Upload a picture of the bill</p>
      {!image ? (
        <Dropzone
          onDrop={acceptFiles}
          onReject={rejectFiles}
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
                  The attached file should not exceed 5mb
                </Text>
              </div>
            </Group>
          )}
        </Dropzone>
      ) : (
        <div
          style={{
            width: 400,
            margin: "auto",
            position: "relative",
          }}
        >
          <LoadingOverlay
            visible={isUploading}
            radius="md"
            loader={
              <>
                <Player
                  autoplay
                  loop
                  src={UploadingIcon}
                  style={{ height: "300px", width: "300px" }}
                />
                <Text size="md">Uploading image to Firebase...</Text>
              </>
            }
          />
          <Image
            radius="md"
            src={URL.createObjectURL(image)}
            alt="Bill preview"
          />
        </div>
      )}

      <Group style={{ marginBottom: 50 }} position="center" mt="xl">
        {!!image && (
          <Button variant="default" onClick={tryAgain}>
            Upload another
          </Button>
        )}
        <Button color="yellow" onClick={tryUploadImage}>
          Next step
        </Button>
      </Group>
    </Box>
  );
}
