import { Box, Container, List } from '@mui/material';
import { useState } from 'react';
import { useFetch } from 'react-fast-fetch';
import Paginated from '../../types/Paginated';
import Font from '../../types/models/Font';

export default function FontListPage() {
  const [page, setPage] = useState(1);
  const { data } = useFetch<Paginated<Font>>(`/fonts?page=${page}&perPage=20`);

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Container>
        <List>
          {data?.data?.map((item) => (
            <div key={item.id}>
              <div>{item.family}</div>

              <svg
                viewBox="0 0 500 25"
                fill="currentColor"
                dangerouslySetInnerHTML={{ __html: item.files?.[0]?.langs?.[0]?.preview }}
              ></svg>
            </div>
          ))}
        </List>
      </Container>
    </Box>
  );
}
