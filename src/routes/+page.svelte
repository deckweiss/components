<script lang="ts">
	import LoadingImage from "$lib/registry/blocks/loading-image/loading-image.svelte";
	import ComponentShowcase from "$lib/components/component-showcase.svelte";
	import { pageLoading, PageProgress } from "$lib/registry/blocks/page-progress";
	import { Button } from "$lib/components/ui/button";
	import { toaster } from "$lib/registry/blocks/toaster";
	import { Toaster } from "$lib/registry/ui/sonner";
	import DataTable from "$lib/registry/blocks/data-table/data-table.svelte";
	import type { ColumnDef, Row } from "@tanstack/table-core";
	import { createRawSnippet } from "svelte";
	import { renderSnippet } from "$lib/components/ui/data-table";
	import { buttonVariants } from "$lib/registry/ui/button";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { dataTableData, type Payment } from "./sample-data";
	import DataTableUsage from "./data-table-example.txt?raw";
	import Input from "$lib/components/ui/input/input.svelte";

	const code = {
		"loading-image": `<LoadingImage
\tsrc="https://picsum.photos/id/237/200/300"
\talt="dog" />

<LoadingImage
\tsrc="https://deckweiss.at/non-existing-image.jpg"
\tclass="w-30"
\tcontainerClass="h-50 bg-[#00ff00] text-center w-50">
\t{#snippet loading()}
\t\t...
\t{/snippet}

\t{#snippet error()}
\t\t:(
\t{/snippet}
</LoadingImage>`,
		"page-progress": `<div class="fixed top-0 z-[99] w-full">
\t<PageProgress />
</div>`,
		toaster: `toaster.pushToast({message: 'Test', type: 'success'});`,
		dataTable: DataTableUsage,
	};
	let locale = $state("de");
	let emailHeader = $derived(locale === "de" ? "E-Mail" : "Email");

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
			filterLabel(value: unknown) {
				return "Label: " + value;
			},
			enableColumnFilter: true,
			enableHiding: true,
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
			enableSorting: true,
			enableHiding: true,
		},
		{
			id: "amount",
			accessorKey: "amount",
			header: "Amount",
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
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => renderSnippet(dataTableActions, row.original),
		},
	];
</script>

<div class="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 px-4 py-8">
	<header class="flex flex-col gap-1">
		<h1 class="text-3xl font-bold tracking-tight">Deckweiss Component Registry</h1>
		<p class="text-muted-foreground">
			A custom registry for distributing code using shadcn-svelte.
		</p>
		<br />
		<p>Use these first:</p>
		<ul class="ml-5 list-disc">
			<li>
				<a href="https://next.shadcn-svelte.com">ShadCn Svelte</a>
			</li>
			<li>
				<a href="https://www.shadcn-svelte-extras.com">ShadCn Svelte Extras</a>
			</li>
		</ul>
	</header>
	<main class="flex flex-1 flex-col gap-8">
		<ComponentShowcase
			name="Loading Image"
			componentKey="loading-image"
			description="A loading image component"
			code={code["loading-image"]}
		>
			<div class="relative flex min-h-[400px] flex-col items-center justify-center gap-4">
				<LoadingImage src="https://picsum.photos/id/237/200/300" alt="dog" />

				<LoadingImage
					src="https://deckweiss.at/non-existing-image.jpg"
					class="w-30"
					containerClass="h-50 bg-[#00ff00] text-center w-50"
				>
					{#snippet loading()}
						...
					{/snippet}

					{#snippet error()}
						:(
					{/snippet}
				</LoadingImage>
			</div>
		</ComponentShowcase>

		<ComponentShowcase
			name="Page Progress"
			componentKey="page-progress"
			description="A page loading progress bar."
			code={code["page-progress"]}
		>
			<div class="flex flex-col gap-2">
				<PageProgress />

				<Button
					onclick={() => {
						pageLoading.invocers = ["test"];

						setTimeout(() => {
							pageLoading.invocers = [];
						}, 1000);
					}}
				>
					Test
				</Button>
			</div>
		</ComponentShowcase>

		<ComponentShowcase
			name="Custom Toast"
			componentKey="toaster"
			description="A toast component with customized look."
			code={code["toaster"]}
			codeLang="typescript"
		>
			<div class="flex flex-col gap-2">
				<Toaster position="bottom-left" offset="20px" />

				<Button
					onclick={() => {
						toaster.pushToast({ message: "Test", type: "success" });
					}}
				>
					Test
				</Button>
			</div>
		</ComponentShowcase>

		<ComponentShowcase
			name="DataTable"
			componentKey="data-table"
			description="Fully functional data table: sort, filter, column toggle, row selection, row expansion and pagination"
			code={code["dataTable"]}
			codeLang="svelte"
		>
			<Button onclick={() => (locale = locale === "de" ? "en" : "de")}
				>Set locale to {locale === "de" ? "en" : "de"}</Button
			>

			<DataTable
				{columns}
				data={dataTableData}
				enableExpanding
				enablePagination
				enableRowSelection
				onRowClick={(row) => row.toggleExpanded()}
			>
				{#snippet expandedRow(row)}
					<pre>{JSON.stringify(row.original, null, 4)}</pre>
				{/snippet}

				{#snippet customFilters(table)}
					<div class="bg-watermelon px-2 py-2">
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
		</ComponentShowcase>
	</main>
</div>

{#snippet dataTableActions(row: Row<Payment>)}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}>
			...
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
