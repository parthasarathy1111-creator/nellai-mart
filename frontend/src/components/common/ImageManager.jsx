import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { DEFAULT_PLACEHOLDER_IMAGE } from "../../constants/placeholders";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function ImageManager({
  currentImageUrl = "",
  onImageChange,
  label = "Image",
  disabled = false,
  fallbackPlaceholder = DEFAULT_PLACEHOLDER_IMAGE,
}) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isMarkedForRemoval, setIsMarkedForRemoval] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [imageLoadError, setImageLoadError] = useState(false);

  // Sync when currentImageUrl changes from parent
  useEffect(() => {
    setSelectedFile(null);
    setIsMarkedForRemoval(false);
    setShowRemoveConfirm(false);
    setValidationError("");
    setImageLoadError(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  }, [currentImageUrl]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (e) => {
    setValidationError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be re-selected if desired
    e.target.value = "";

    // 1. Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setValidationError("Please select a JPG, PNG, or WebP image.");
      return;
    }

    // 2. Validate file size (5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError("Image size is too large (maximum allowed size is 5MB).");
      return;
    }

    // Revoke previous preview if any
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setIsMarkedForRemoval(false);
    setShowRemoveConfirm(false);
    setImageLoadError(false);

    if (onImageChange) {
      onImageChange(file, false);
    }
  };

  const handleCancelChanges = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setIsMarkedForRemoval(false);
    setShowRemoveConfirm(false);
    setValidationError("");
    setImageLoadError(false);

    if (onImageChange) {
      onImageChange(null, false);
    }
  };

  const handleConfirmRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    setIsMarkedForRemoval(true);
    setShowRemoveConfirm(false);
    setValidationError("");

    if (onImageChange) {
      onImageChange(null, true);
    }
  };

  // Determine what image to display
  let displaySrc = fallbackPlaceholder;
  let statusBadge = null;

  if (isMarkedForRemoval) {
    displaySrc = fallbackPlaceholder;
    statusBadge = (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
        Marked for removal (saves on submit)
      </span>
    );
  } else if (previewUrl) {
    displaySrc = previewUrl;
    statusBadge = (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
        New image preview (saves on submit)
      </span>
    );
  } else if (currentImageUrl && !imageLoadError) {
    displaySrc = currentImageUrl;
  }

  const hasActiveImage = (Boolean(currentImageUrl) && !isMarkedForRemoval) || Boolean(selectedFile);
  const hasPendingChange = Boolean(selectedFile) || isMarkedForRemoval;

  return (
    <div className="space-y-3">
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
        {statusBadge}
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between">
          <span>⚠️ {validationError}</span>
          <button
            type="button"
            onClick={() => setValidationError("")}
            className="text-red-500 hover:text-red-700 font-bold ml-2 text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Image Container */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
        {/* Thumbnail Preview */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-gray-200 bg-white shrink-0 shadow-xs flex items-center justify-center">
          <img
            src={displaySrc}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={() => setImageLoadError(true)}
          />
        </div>

        {/* Action Controls */}
        <div className="flex-1 w-full space-y-2">
          {showRemoveConfirm ? (
            /* Remove Confirmation Dialog */
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
              <p className="text-xs font-semibold text-red-800">
                Are you sure you want to remove this image?
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={handleConfirmRemove}
                  disabled={disabled}
                >
                  Confirm Remove
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRemoveConfirm(false)}
                  disabled={disabled}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                {!hasActiveImage ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                  >
                    + Add Image
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={disabled}
                    >
                      Replace Image
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => setShowRemoveConfirm(true)}
                      disabled={disabled}
                    >
                      Remove Image
                    </Button>
                  </>
                )}

                {hasPendingChange && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={handleCancelChanges}
                    disabled={disabled}
                  >
                    Cancel Changes
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500">
                Supported formats: <strong>JPG, PNG, WebP</strong>. Max file size: <strong>5 MB</strong>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageManager;
