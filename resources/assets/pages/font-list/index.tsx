import { Box, Container, List, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import { useFetch } from 'react-fast-fetch';
import Paginated from '../../types/Paginated';
import Font from '../../types/models/Font';

export default function FontListPage() {
  const [page, setPage] = useState(1);
  const { data } = useFetch<Paginated<Font>>(`/fonts?page=${page}`);

  return (
    <Box>
      <Container maxWidth="md">
        <List>
          {data?.data?.map((item) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.family} />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
}
