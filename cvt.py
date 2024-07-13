import os
import numpy as np
import imageio.v3 as imageio

def convert_exr_to_webp(exr_path, webp_path, quality=90):
    # Read the EXR image using imageio
    exr_image = imageio.imread(exr_path, plugin="EXR-FI")

    # Check if the image is loaded correctly
    if exr_image is None:
        print(f"Error: Unable to load image at {exr_path}")
        return

    # Normalize the image if it's in HDR format
    if exr_image.dtype == np.float32:
        normalized_image = (exr_image - np.min(exr_image)) / (np.max(exr_image) - np.min(exr_image)) * 255
        normalized_image = normalized_image.astype(np.uint8)
    else:
        normalized_image = exr_image

    # Save as WebP using imageio with the specified quality
    imageio.imwrite(webp_path, normalized_image, format='webp', quality=quality)

    print(f"Converted EXR to WebP: {webp_path}")

def traverse_and_convert(directory, quality=90):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith('.exr'):
                exr_path = os.path.join(root, file)
                webp_path = os.path.join(root, file.rsplit('.', 1)[0] + '.webp')
                print(f"[INFO] found exr: {exr_path}")
                convert_exr_to_webp(exr_path, webp_path, quality)

if __name__ == "__main__":
    directory = "public/textures"
    traverse_and_convert(directory)
