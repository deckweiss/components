<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import example1Code from "./example1-code.txt?raw";
	import { Button } from "$lib/components/ui/button";
	import DataTable from "$lib/registry/blocks/data-table/data-table.svelte";
	import type { ColumnDef, Row } from "@tanstack/table-core";
	import { createRawSnippet } from "svelte";
	import { renderSnippet } from "$lib/components/ui/data-table";
	import { buttonVariants } from "$lib/registry/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { dataTableData, type Payment } from "./sample-data";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Ellipsis } from "@lucide/svelte";

	let { data } = $props();

	let locale = $state("de");
	let emailHeader = $derived(locale === "de" ? "E-Mail" : "Email");
	let amountHeader = $derived(locale === "de" ? "Betrag" : "Amount");
	let actionsHeader = $derived(locale === "de" ? "Aktionen" : "Actions");

	const columns: ColumnDef<Payment>[] = [
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const statusSnippet = createRawSnippet<[string]>((getStatus) => {
					const status = getStatus();
					return {
						render: () => `<div class="capitalize">${status}</div>`,
					};
				});
				return renderSnippet(statusSnippet, row.getValue("status"));
			},
			enableColumnFilter: true,
			enableHiding: true,
			minSize: 50,
			size: 100,
			maxSize: 200,
		},
		{
			accessorKey: "email",
			header: () => emailHeader,
			cell: ({ row }) => {
				const emailSnippet = createRawSnippet<[string]>((getEmail) => {
					const email = getEmail();
					return {
						render: () => `<div class="lowercase">${email}</div>`,
					};
				});

				return renderSnippet(emailSnippet, row.getValue("email"));
			},
			enableColumnFilter: true,
			enableSorting: true,
			enableHiding: true,
			minSize: 100,
			size: 200,
			maxSize: 300,
		},
		{
			id: "amount",
			accessorKey: "amount",
			header: () => amountHeader,
			cell: ({ row }) => {
				const amountCellSnippet = createRawSnippet<[string]>((getAmount) => {
					const amount = getAmount();
					return {
						render: () => `<div class="text-right font-medium">${amount}</div>`,
					};
				});
				const formatter = new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
				});

				return renderSnippet(
					amountCellSnippet,
					formatter.format(Number.parseFloat(row.getValue("amount")))
				);
			},
			enableSorting: true,
			minSize: 100,
			size: 150,
			maxSize: 200,
		},
		{
			id: "actions",
			enableHiding: false,
			header: () => actionsHeader,
			cell: ({ row }) => renderSnippet(dataTableActions, row),
			minSize: 100,
			size: 150,
		},
	];
</script>

<ComponentPageWrapper component={data.component}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<div>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="px-4 py-8">
						<div class="space-y-4">
							<Button onclick={() => (locale = locale === "de" ? "en" : "de")} variant="outline">
								Set locale to {locale === "de" ? "en" : "de"}
							</Button>
							<DataTable
								{columns}
								data={dataTableData}
								enableExpanding
								enablePagination
								enableRowSelection
								onRowClick={(row) => row.toggleExpanded()}
								enableResizing
							>
								{#snippet expandedRow(row)}
									<pre class="text-xs">{JSON.stringify(row.original, null, 2)}</pre>
								{/snippet}

								{#snippet customFilters(table)}
									<div class="bg-muted px-2 py-2">
										<Input
											placeholder="E-Mail"
											oninput={(event) => {
												const text = event.target.value;
												table.getColumn("email")?.setFilterValue(text);
											}}
										/>
									</div>
								{/snippet}
							</DataTable>
						</div>
					</div>
				</Card>

				<Code code={example1Code} lang="svelte" />
			</div>
		</section>
	{/snippet}
</ComponentPageWrapper>

{#snippet dataTableActions(row: Row<Payment>)}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "sm" })}>
			<Ellipsis class="size-4" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Actions</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>Edit</DropdownMenu.Item>
				<DropdownMenu.Item>Delete</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>Send Confirmation Email</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
