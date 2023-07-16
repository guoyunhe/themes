import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, SxProps, TextField } from '@mui/material';
import axios from 'axios';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import Comment from '../../types/models/Comment';
import isElementInViewport from '../../utils/isElementInViewport';

export interface CommentFormProps {
  comment?: Comment;
  open: boolean;
  onClose: () => void;
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
  open,
  onClose,
  onCreate,
  onUpdate,
  sx,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open) {
      setContent(comment?.content || '');
      // wait for form to fully render
      setTimeout(() => {
        if (rootRef.current && !isElementInViewport(rootRef.current)) {
          rootRef.current.scrollIntoView(false);
        }
      }, 100);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <Box ref={rootRef} sx={sx}>
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t('Comment')}
        multiline
        minRows={3}
        fullWidth
        autoFocus
        sx={{ mb: 2 }}
      />
      <Stack direction="row" spacing={1}>
        <LoadingButton
          loading={submitting}
          variant="contained"
          onClick={() => {
            setSubmitting(true);
            if (comment) {
              axios
                .put<Comment>(`/posts/${postId}/comments/${comment.id}`, { content })
                .then((res) => {
                  onUpdate?.(res.data);
                  onClose();
                })
                .finally(() => {
                  setSubmitting(false);
                });
            } else {
              axios
                .post<Comment>(`/posts/${postId}/comments`, { content, parentId })
                .then((res) => {
                  onCreate?.(res.data);
                  onClose();
                })
                .finally(() => {
                  setSubmitting(false);
                });
            }
          }}
        >
          {t('Submit')}
        </LoadingButton>
        <Button color="inherit" onClick={() => onClose()}>
          {t('Cancel')}
        </Button>
      </Stack>
    </Box>
  );
}
