/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContainerInstanceGroupConstraints } from "./ContainerInstanceGroupConstraints";
import type { ContainerInstanceGroupSSHConfiguration } from "./ContainerInstanceGroupSSHConfiguration";

export type PutContainerInstanceGroupRequestBody = {
	class_name: string;
	name: string;
	constraints?: ContainerInstanceGroupConstraints;
	ssh?: ContainerInstanceGroupSSHConfiguration;
};
