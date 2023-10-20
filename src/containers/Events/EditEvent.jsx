import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "../components/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../utils/https.js";
import ErrorBlock from "../components/ErrorBlock.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isError, error } = useQuery({
    queryKey: ["eventDetail", id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
    stale: 5000,
  });

  const { mutate, isPending: isEditPending } = useMutation({
    mutationKey: ["eventDetail", id],
    mutationFn: updateEvent,
    onMutate: ({ id, event }) => {
      queryClient.cancelQueries({ queryKey: ["eventDetail", id] });
      const previousEventData = queryClient.getQueryData(["eventDetail", id]);

      queryClient.setQueryData(["eventDetail", id], event);
      return { previousEventData };
    },

    onError: (error, data, context) => {
      queryClient.setQueryData(["eventDetail", id], context.previousEventData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["eventDetail", id]);
    },
  });
  function handleSubmit(formData) {
    mutate({ id, event: formData });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }
  let content;
  if (isError)
    content = (
      <>
        <ErrorBlock title="failed to load event" message={error.info?.message || "please check your inputs and try again later."} />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  if (data)
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>

        <button type="submit" className="button">
          {isEditPending ? "Updating..." : "Update"}
        </button>
      </EventForm>
    );

  return <Modal onClose={handleClose}>{content}</Modal>;
}

export function loader({ params }) {
  return queryClient.fetchQuery({ queryKey: ["eventDetail", params.id], queryFn: ({ signal }) => fetchEvent({ id: params.id, signal }) });
}
