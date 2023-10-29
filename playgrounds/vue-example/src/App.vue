<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import trpcClient from '@/providers/trpc';

const { data } = useQuery({
  queryKey: ['me'],
  queryFn: () => trpcClient.users.me.query(),
});
</script>

<template>
  <div>{{ data }}</div>
</template>
