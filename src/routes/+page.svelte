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
	import Slider from "$lib/registry/blocks/slider/slider.svelte";
	import * as Navbar from "$lib/registry/blocks/navbar";
	import { Bell, FileUser, UserIcon } from "@lucide/svelte";
	import DropdownMenuCheckboxItem from "$lib/components/ui/dropdown-menu/dropdown-menu-checkbox-item.svelte";
	import { Button as ZaunkonfiguratorButton } from "$lib/registry/blocks/zaunkonfigurator-button";
	import { PosthogFeedbackButton } from "$lib/registry/blocks/posthogfeedback";

	const code = {
		slider: `<Slider value={[0]} min={0} max={10} step={1} class="w-full" />`,
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
		posthog: `// hooks.client.ts
import { posthog } from 'posthog-js';

posthog.init('YOUR_PROJECT_API_KEY', {
\tapi_host: 'https://us.i.posthog.com',
});


// $lib/analytics/index.ts
import { browser } from '$app/environment';
import type { PostHog } from 'posthog-js';

/**
 * Execute a callback with the PostHog instance.
 * @param callback - The callback to execute.
 * @example
 * \`\`\`ts
 * withPosthog((posthog) => {
 *     posthog.identify('user@example.com');
 * });
 * \`\`\`
 */
export async function withPosthog(callback: (posthog: PostHog) => void): Promise<void> {
    if (browser) {
        await import('posthog-js')
            .then(({ default: posthog }) => {
                try {
                    callback(posthog);
                } catch (error) {
                    console.log('Failed to execute analytics callback:', error);
                }
            })
            .catch((error) => {
                console.log('Failed to load PostHog:', error);
            });
    }
}

export function captureEvent(eventName: string, properties?: Record<string, any>) {
    // Only capture events on the client side
    withPosthog((posthog) => {
        posthog.capture(eventName, properties);
    });
}
`,
		navbar: `<Navbar.Applications>
	<Navbar.ApplicationLink href="/">HR-Manager</Navbar.ApplicationLink>
	<Navbar.ApplicationLink href="#">Verrechnung</Navbar.ApplicationLink>
	<Navbar.ApplicationLink href="#">Dienstplan</Navbar.ApplicationLink>
	<Navbar.ApplicationLink href="#">Zeitaufzeichnung</Navbar.ApplicationLink>
	<Navbar.ApplicationLink href="#">KI-Chatbot</Navbar.ApplicationLink>
	<Navbar.ApplicationLink href="#">Zaunmontagen</Navbar.ApplicationLink>
	<Navbar.ApplicationLink href="#">Terminplaner</Navbar.ApplicationLink>
	<Navbar.ApplicationLink href="#">Bestellverwaltung</Navbar.ApplicationLink>

	{#snippet right()}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class="flex cursor-pointer items-center gap-2">
				<Navbar.ApplicationUser iconColorClass="bg-[#ff0000]">
					Peter Arnold
				</Navbar.ApplicationUser>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				<DropdownMenu.Group>
					<DropdownMenu.Label>Peter Arnold</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Einstellungen</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Abmelden</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/snippet}
</Navbar.Applications>

<Navbar.Layer1 appName="HR Manager">
	{#snippet logo()}
		<FileUser class="text-[#ff0044]" />
	{/snippet}

	<Navbar.Layer1Link href="/">Termine</Navbar.Layer1Link>
	<Navbar.Layer1Link href="#" badge="99+">Bewerbungen</Navbar.Layer1Link>
	<Navbar.Layer1Link href="#">Stellenausschreibungen</Navbar.Layer1Link>

	{#snippet right()}
		<Navbar.Layer1IconButton badge="2">
			<Bell size={16} />
		</Navbar.Layer1IconButton>
	{/snippet}
</Navbar.Layer1>

<Navbar.Layer2>
	<Navbar.Layer2Link href="/">Alle Bewerbungen</Navbar.Layer2Link>
	<Navbar.Layer2Link href="#" badge="99+">Aufgaben</Navbar.Layer2Link>
	<Navbar.Layer2Link href="#">Evidenz</Navbar.Layer2Link>
	<Navbar.Layer2Link href="#">Archiv</Navbar.Layer2Link>
</Navbar.Layer2>`,
		"zaunkonfigurator-button": `<script lang="ts">
	import { Button } from "$lib/registry/blocks/zaunkonfigurator-button";
<\/script>
<ZaunkonfiguratorButton variant="default">Base</ZaunkonfiguratorButton>
<ZaunkonfiguratorButton variant="secondary">Secondary</ZaunkonfiguratorButton>
<ZaunkonfiguratorButton variant="outline">Outline</ZaunkonfiguratorButton>
<ZaunkonfiguratorButton variant="ghost">Ghost</ZaunkonfiguratorButton>
<ZaunkonfiguratorButton variant="link">Link</ZaunkonfiguratorButton>
<ZaunkonfiguratorButton variant="destructive">Destructive</ZaunkonfiguratorButton>`,
		"posthogfeedback-button": `<script lang="ts">
	import { PosthogFeedbackButton } from "$lib/registry/blocks/posthogfeedback";
<\/script>

<PosthogFeedbackButton appName="example-app" />

<!-- With custom position -->
<PosthogFeedbackButton appName="example-app" position="bottom-left" />

<!-- With custom feedback types -->
<PosthogFeedbackButton
	appName="example-app"
	feedbackTypes={[
		{ value: "bug", label: "Bug Report", emoji: "🐛" },
		{ value: "feature", label: "Feature Request", emoji: "✨" },
		{ value: "comment", label: "Comment", emoji: "💬" },
		{ value: "question", label: "Question", emoji: "❓" }
	]}
/>`,
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
			name="Slider"
			componentKey="slider"
			description="A slider component"
			code={code["slider"]}
		>
			<Slider value={[0]} min={0} max={10} step={1} class="w-full" />
		</ComponentShowcase>
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
				enableResizing
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

		<ComponentShowcase
			name="Navbar"
			componentKey="navbar"
			description="A navbar component"
			code={code["navbar"] ?? ""}
			codeLang="svelte"
		>
			<Navbar.Applications>
				<Navbar.ApplicationLink href="/">HR-Manager</Navbar.ApplicationLink>
				<Navbar.ApplicationLink href="#">Verrechnung</Navbar.ApplicationLink>
				<Navbar.ApplicationLink href="#">Dienstplan</Navbar.ApplicationLink>
				<Navbar.ApplicationLink href="#">Zeitaufzeichnung</Navbar.ApplicationLink>
				<Navbar.ApplicationLink href="#">KI-Chatbot</Navbar.ApplicationLink>
				<Navbar.ApplicationLink href="#">Zaunmontagen</Navbar.ApplicationLink>
				<Navbar.ApplicationLink href="#">Terminplaner</Navbar.ApplicationLink>
				<Navbar.ApplicationLink href="#">Bestellverwaltung</Navbar.ApplicationLink>

				{#snippet right()}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class="flex cursor-pointer items-center gap-2">
							<Navbar.ApplicationUser iconColorClass="bg-[#ff0000]">
								Peter Arnold
							</Navbar.ApplicationUser>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Group>
								<DropdownMenu.Label>Peter Arnold</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>Einstellungen</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>Abmelden</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/snippet}
			</Navbar.Applications>

			<Navbar.Layer1 appName="HR Manager">
				{#snippet logo()}
					<FileUser class="text-[#ff0044]" />
				{/snippet}

				<Navbar.Layer1Link href="/">Termine</Navbar.Layer1Link>
				<Navbar.Layer1Link href="#" badge="99+">Bewerbungen</Navbar.Layer1Link>
				<Navbar.Layer1Link href="#">Stellenausschreibungen</Navbar.Layer1Link>

				{#snippet right()}
					<Navbar.Layer1IconButton badge="2">
						<Bell size={16} />
					</Navbar.Layer1IconButton>
				{/snippet}
			</Navbar.Layer1>

			<Navbar.Layer2>
				<Navbar.Layer2Link href="/">Alle Bewerbungen</Navbar.Layer2Link>
				<Navbar.Layer2Link href="#" badge="99+">Aufgaben</Navbar.Layer2Link>
				<Navbar.Layer2Link href="#">Evidenz</Navbar.Layer2Link>
				<Navbar.Layer2Link href="#">Archiv</Navbar.Layer2Link>
			</Navbar.Layer2>
		</ComponentShowcase>

		<ComponentShowcase
			name="Zaunkonfigurator Button"
			componentKey="zaunkonfigurator-button"
			description="A button component from the Zaunkonfigurator project"
			code={code["zaunkonfigurator-button"]}
		>
			<div class="flex flex-wrap gap-2">
				<ZaunkonfiguratorButton variant="default">Base</ZaunkonfiguratorButton>
				<ZaunkonfiguratorButton variant="secondary">Secondary</ZaunkonfiguratorButton>
				<ZaunkonfiguratorButton variant="outline">Outline</ZaunkonfiguratorButton>
				<ZaunkonfiguratorButton variant="ghost">Ghost</ZaunkonfiguratorButton>
				<ZaunkonfiguratorButton variant="link">Link</ZaunkonfiguratorButton>
				<ZaunkonfiguratorButton variant="destructive">Destructive</ZaunkonfiguratorButton>
				<ZaunkonfiguratorButton variant="animated">Animated</ZaunkonfiguratorButton>
			</div>
		</ComponentShowcase>

		<ComponentShowcase
			name="Posthog"
			componentKey="posthog"
			description="Dynamically load posthog into browser environments"
			code={code["posthog"]}
			codeLang="typescript"
			hideInstallation
		></ComponentShowcase>

		<ComponentShowcase
			name="Posthog Feedback Button"
			componentKey="posthogfeedback-button"
			description="A feedback button with modal dialog integrated with Posthog"
			code={code["posthogfeedback-button"]}
			codeLang="svelte"
		>
			<div class="relative min-h-[400px] rounded-lg border border-dashed p-8">
				<p class="text-muted-foreground mb-4 text-sm">
					Click the button in the bottom-right corner to open the feedback modal.
				</p>
				<PosthogFeedbackButton appName="component-showcase" position="bottom-right" />
			</div>
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
