import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, SxProps, TextField } from '@mui/material';
import axios from 'axios';
import { t } from 'i18next';
import { useState } from 'react';
import Comment from '../../types/models/Comment';

export interface CommentFormProps {
  comment?: Comment;
  onClose?: () => void;
  onCreate?: (comment: Comment) => void;
  onUpdate?: (comment: Comment) => void;
  postId: number | string | null;
  parentId?: number | string | null;
  sx?: SxProps;
}

export default function CommentForm({
  comment,
  postId,
  parentId,
  onClose,
  onCreate,
  onUpdate,
  sx,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  return (
    <Box sx={sx}>
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t('Comment')}
        multiline
        minRows={3}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Stack direction="row" spacing={1}>
        <LoadingButton
          loading={submitting}
          variant="contained"
          disabled={content.trim().length === 0}
          onClick={() => {
            setSubmitting(true);
            if (comment) {
              axios
                .put<Comment>(`/posts/${postId}/comments/${comment.id}`, { content })
                .then((res) => {
                  onUpdate?.(res.data);
                  onClose?.();
                })
                .finally(() => {
                  setSubmitting(false);
                });
            } else {
              axios
                .post<Comment>(`/posts/${postId}/comments`, { content, parentId })
                .then((res) => {
                  onCreate?.(res.data);
                  onClose?.();
                })
                .finally(() => {
                  setSubmitting(false);
                });
            }
          }}
        >
          {t('Submit')}
        </LoadingButton>
        {onClose && (
          <Button color="inherit" onClick={() => onClose?.()}>
            {t('Cancel')}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
