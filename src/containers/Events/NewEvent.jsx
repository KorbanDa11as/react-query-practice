import { Link, useNavigate } from "react-router-dom";

import Modal from "../components/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent, queryClient } from "../../utils/https.js";
import { useMutation } from "@tanstack/react-query";
import ErrorBlock from "../components/ErrorBlock.jsx";

export default function NewEvent() {
  const navigate = useNavigate();
  const { mutate, isError, error, isPending } = useMutation({
    mutationKey: ["create-event"],
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("../");
    },
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            {isPending ? "Submitting..." : "Create"}
          </button>
        </>
      </EventForm>
      {isError && <ErrorBlock title="An error occurred" message={error?.info.message || "Failed to create event"} />}
    </Modal>
  );
}
