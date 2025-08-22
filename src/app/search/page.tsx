import Container from "@mui/material/Container";
import ClientSearch from "./components/client.search";

interface ISearchPageProps {}

const SearchPage = ({}: ISearchPageProps) => {
  return (
    <Container sx={{ mt: 3 }}>
      <ClientSearch />
    </Container>
  );
};

export default SearchPage;
