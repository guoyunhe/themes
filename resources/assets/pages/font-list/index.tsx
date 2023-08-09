import { Box, Card, CardHeader, Container, Pagination } from '@mui/material';
import { useFetch } from 'react-fast-fetch';
import { useSearchParams } from 'react-router-dom';
import Paginated from '../../types/Paginated';
import Font from '../../types/models/Font';

export default function FontListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useFetch<Paginated<Font>>(`/fonts?${searchParams.toString()}`);
  const page = Number(searchParams.get('page') || 1);
  const totalPage = data?.meta ? Math.ceil(data.meta.total / data.meta.perPage) : 1;

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Container>
        <Box sx={{ my: 3 }}>
          {data?.data?.map((item) => (
            <Card key={item.id} sx={{ mb: 3 }}>
              <CardHeader title={item.family} />
              <svg
                viewBox="0 0 500 25"
                fill="currentColor"
                dangerouslySetInnerHTML={{ __html: item.files?.[0]?.langs?.[0]?.preview }}
              ></svg>
            </Card>
          ))}
        </Box>
        <Pagination
          count={totalPage}
          page={page}
          onChange={(_e, p) =>
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.set('page', String(p));
              return next;
            })
          }
          sx={{ my: 3 }}
        />
      </Container>
    </Box>
  );
}
