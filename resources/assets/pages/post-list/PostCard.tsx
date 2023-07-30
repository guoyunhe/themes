import { useRequireAuth } from '@guoyunhe/react-auth';
import { Comment as CommentIcon } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CardHeader, SxProps } from '@mui/material';
import axios from 'axios';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import Liker from '../../components/liker';
import RelativeTime from '../../components/relative-time';
import UserBrief from '../../components/user-brief';
import Post from '../../types/models/Post';

export interface PostCardProps {
  post: Post;
  excerptLength?: number;
  sx?: SxProps;
}

export default function PostCard({ post, excerptLength = 255, sx }: PostCardProps) {
  const requireAuth = useRequireAuth();

  const { userId, tagId, postId, search } = useParams();

  const path = useMemo(() => {
    if (userId) {
      return `/u/${userId}/p/${post.id}`;
    } else if (tagId) {
      return `/t/${tagId}/p/${post.id}`;
    } else if (search) {
      return `/s/${search}/p/${post.id}`;
    } else {
      return `/p/${post.id}`;
    }
  }, [userId, tagId, search, post.id]);

  return (
    <Card
      variant="outlined"
      component={Link}
      to={path}
      sx={{
        display: 'flex',
        overflow: 'hidden',
        textDecoration: 'none',
        borderColor: (theme) =>
          postId === post.id.toString() ? theme.palette.primary.main : undefined,
        ...sx,
      }}
    >
      <Box>
        <Liker
          like={post.likes?.[0]?.like}
          likesSum={post.likesSum}
          onLike={(like) => {
            if (requireAuth()) {
              axios.post(`/posts/${post.id}/likes`, { like });
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          size="small"
        />
      </Box>
      <Box>
        <CardHeader
          title={post.title}
          subheader={
            <>
              <UserBrief user={post.user} />
              &nbsp;
              <RelativeTime date={post.createdAt} />
            </>
          }
          sx={{ pl: 0 }}
        />
        <CardContent sx={{ pl: 0, py: 0 }}>
          {post.content.substring(0, excerptLength)} {post.content.length > excerptLength && '...'}
        </CardContent>
        <CardActions sx={{ pl: 0 }}>
          <Button startIcon={<CommentIcon />} color="inherit">
            {post.commentsCount}
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}
