import { useState } from "react";

import ImagePicker from "../ImagePicker.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchSelectableImages } from "../../utils/https.js";
import LoadingIndicator from "../components/LoadingIndicator.jsx";
import ErrorBlock from "../components/ErrorBlock.jsx";

export default function EventForm({ inputData, onSubmit, children }) {
  const [selectedImage, setSelectedImage] = useState(inputData?.image);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["event-images"],
    queryFn: fetchSelectableImages,
  });

  function handleSelectImage(image) {
    setSelectedImage(image);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    onSubmit({ ...data, image: selectedImage });
  }

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      <p className="control">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" defaultValue={inputData?.title ?? ""} />
      </p>

      <div className="control">
        {isLoading && <LoadingIndicator />}
        {isError && <ErrorBlock title="An error occurred" message={error?.info.message || "Failed to fetch images"} />}
        {data && <ImagePicker images={data} onSelect={handleSelectImage} selectedImage={selectedImage} />}
      </div>

      <p className="control">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" defaultValue={inputData?.description ?? ""} />
      </p>

      <div className="controls-row">
        <p className="control">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" defaultValue={inputData?.date ?? ""} />
        </p>

        <p className="control">
          <label htmlFor="time">Time</label>
          <input type="time" id="time" name="time" defaultValue={inputData?.time ?? ""} />
        </p>
      </div>

      <p className="control">
        <label htmlFor="location">Location</label>
        <input type="text" id="location" name="location" defaultValue={inputData?.location ?? ""} />
      </p>

      <p className="form-actions">{children}</p>
    </form>
  );
}