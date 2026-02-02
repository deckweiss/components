<script lang="ts">
	import ComponentPageWrapper from "$lib/components/page-layout/component-page-wrapper.svelte";
	import Code from "$lib/components/ui/code/code.svelte";
	import { Card } from "$lib/components/ui/card";
	import example1Code from "./example1-code.txt?raw";
	import * as Navbar from "$lib/registry/blocks/navbar";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Bell, FileUser } from "@lucide/svelte";

	let { data } = $props();
</script>

<ComponentPageWrapper component={data.component}>
	{#snippet firstExample()}
		<section class="flex flex-col gap-4">
			<div>
				<Card class="mb-0 rounded-b-none border-b-0">
					<div class="px-4 py-8">
						<div>
							<Navbar.Applications>
								<Navbar.ApplicationLink href="/">HR-Manager</Navbar.ApplicationLink>
								<Navbar.ApplicationLink href="#">Verrechnung</Navbar.ApplicationLink>
								<Navbar.ApplicationLink href="#">Dienstplan</Navbar.ApplicationLink>
								<Navbar.ApplicationLink href="#">Zeitaufzeichnung</Navbar.ApplicationLink>

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
						</div>
					</div>
				</Card>

				<Code code={example1Code} lang="svelte" />
			</div>
		</section>
	{/snippet}
</ComponentPageWrapper>
