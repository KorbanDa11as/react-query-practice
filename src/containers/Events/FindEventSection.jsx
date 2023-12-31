import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { fetchEvents } from "../../utils/https";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorBlock from "../components/ErrorBlock";
import EventItem from "./EventItem";

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", searchTerm],
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, searchTerm: queryKey[1] }),
    enabled: searchTerm !== undefined,
  });

  function handleSubmit(event) {
    event.preventDefault();
    console.log("event.target.value :>> ", event.target);
    setSearchTerm(searchElement.current.value);
  }
  let content = <p>Please enter a search term and to find events.</p>;
  if (isLoading) content = <LoadingIndicator />;
  if (isError) content = <ErrorBlock title={"error in search"} message={error?.info.message || "error in search."} />;
  if (data) content = data.map((event) => <EventItem key={event.id} event={event} />);

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input type="search" placeholder="Search events" ref={searchElement} />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
