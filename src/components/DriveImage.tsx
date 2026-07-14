import React from "react";
import { parseGoogleDriveUrl } from "@/lib/utils";

/**
 * Drop-in replacement for <img> that automatically converts
 * Google Drive sharing URLs to direct embeddable image URLs.
 *
 * Supports:
 *   - https://drive.google.com/file/d/{id}/view?usp=sharing
 *   - https://drive.google.com/uc?id={id}
 *   - Any other URL (passed through unchanged)
 */
interface DriveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
}

const DriveImage = React.forwardRef<HTMLImageElement, DriveImageProps>(
  ({ src, ...props }, ref) => {
    const resolvedSrc = src ? parseGoogleDriveUrl(src) : src;
    return (
      <img
        ref={ref}
        src={resolvedSrc}
        referrerPolicy="no-referrer"
        {...props}
      />
    );
  }
);

DriveImage.displayName = "DriveImage";

export default DriveImage;
