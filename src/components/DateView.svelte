<script lang="ts">
  interface Props {
    date: Date | string | null;
    long?: boolean;
  }

  let { date, long }: Props = $props();

  const formatDate = (date: Date | string | null): string => {
    if (!date) return ""; // If date is null, return an empty string

    const d = new Date(date); // Convert date string to Date object
    const hour = d.getHours().toString().padStart(2, "0"); // Get hour with leading zero
    const minute = d.getMinutes().toString().padStart(2, "0"); // Get minute with leading zero
    const day = d.getDate().toString().padStart(2, "0"); // Get day with leading zero
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Get month with leading zero
    const year = d.getFullYear(); // Get full year

    if (long) {
      return `${day}/${month}/${year} ${hour}:${minute}`;
    } else {
      return `${day}/${month}/${year}`;
    }
  };

  let formatted = $derived(formatDate(date));
</script>

{formatted}
