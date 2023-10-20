import LoadingIndicator from "../components/LoadingIndicator.jsx";
import ErrorBlock from "../components/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../utils/https.js";
import { useParams } from "react-router-dom";

export default function NewEventsSection() {
  const params = useParams();
  console.log("params :>> ", params);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events"],
    queryFn: ({ signal }) => fetchEvents({ signal }),
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
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
