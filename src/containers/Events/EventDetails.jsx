import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../utils/https.js";
import LoadingIndicator from "../components/LoadingIndicator.jsx";
import ErrorBlock from "../components/ErrorBlock.jsx";
import Confirm from "../components/ConfirmModal.jsx";
import { useState } from "react";

export default function EventDetails() {
  const { id } = useParams();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteConfirmMsg, setDeleteConfirmMsg] = useState("Are you sure you want to delete this Event?");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["eventDetail", id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });
  const navigate = useNavigate();
  const {
    mutate: handleDelete,
    isError: deleteErrorState,
    error: deleteError,
  } = useMutation({
    mutationKey: ["delete-event"],
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("../");
    },
    onMutate: () => setDeleteConfirmMsg("Deleting..."),
  });
  let content;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = <ErrorBlock title="An error occurred" message={error?.info.message || "Failed to fetch events"} />;
  }
  if (data) {
    content = (
      <>
        <img src={`http://localhost:3000/${data.image}`} alt="" />
        <div id="event-details-info">
          <div>
            <p id="event-details-location">{data.location}</p>
            <time dateTime={`${data.date}${data.time}`}>
              {data.date} @ {data.time}
            </time>
          </div>
          <p id="event-details-description">{data.description}</p>
        </div>
      </>
    );
  }
  return (
    <>
      <Outlet />
      {confirmDelete && <Confirm confirmationMsg={deleteConfirmMsg} onConfirm={() => handleDelete({ id })} onCancel={() => setConfirmDelete(false)} />}
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          {deleteErrorState && <ErrorBlock title="An error occurred" message={deleteError?.info.message || "Failed to fetch events"} />}
          <h1>{data ? data.title : "Loading..."}</h1>
          <nav>
            <button onClick={() => setConfirmDelete(true)}>{"Delete"}</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">{content}</div>
      </article>
    </>
  );
}
