import assert from "node:assert";
import { ContainerInstanceGroupsService } from "@cloudflare/containers-shared";
import { fillOpenAPIConfiguration } from "../cloudchamber/common";
import { createDurableObjectNamespaceResolver } from "./deploy";
import { containersScope } from ".";
import type { PutContainerInstanceGroupRequestBody } from "@cloudflare/containers-shared";
import type {
	Config,
	ContainerInstanceGroupConfig,
} from "@cloudflare/workers-utils";

type DeployContainerInstanceGroupsArgs = {
	versionId: string;
	accountId: string;
	scriptName: string;
};

function toRequestBody(
	group: ContainerInstanceGroupConfig
): PutContainerInstanceGroupRequestBody {
	assert(
		group.name,
		"container instance group name should be set by validation"
	);
	return {
		class_name: group.class_name,
		name: group.name,
		...(group.constraints === undefined
			? {}
			: {
					constraints: {
						...(group.constraints.jurisdiction === undefined
							? {}
							: {
									jurisdiction: group.constraints.jurisdiction.toLowerCase() as
										| "eu"
										| "fedramp",
								}),
						...(group.constraints.regions === undefined
							? {}
							: {
									regions: group.constraints.regions.map((region) =>
										region.toUpperCase()
									),
								}),
					},
				}),
		...(group.ssh === undefined
			? {}
			: {
					ssh: {
						...(group.ssh.enabled === undefined
							? {}
							: { enabled: group.ssh.enabled }),
						...(group.ssh.authorized_keys === undefined
							? {}
							: { authorized_keys: group.ssh.authorized_keys }),
					},
				}),
	};
}

export async function deployContainerInstanceGroups(
	config: Config,
	{ versionId, accountId, scriptName }: DeployContainerInstanceGroupsArgs
): Promise<void> {
	const groups =
		config.containers?.filter(
			(container): container is ContainerInstanceGroupConfig =>
				container.type === "instance"
		) ?? [];
	if (groups.length === 0) {
		return;
	}

	await fillOpenAPIConfiguration(config, containersScope);
	const resolveNamespaceId = createDurableObjectNamespaceResolver(config, {
		versionId,
		accountId,
		scriptName,
	});

	for (const group of groups) {
		const namespaceId = await resolveNamespaceId(group.class_name);
		await ContainerInstanceGroupsService.putContainerInstanceGroup(
			namespaceId,
			toRequestBody(group)
		);
	}
}
