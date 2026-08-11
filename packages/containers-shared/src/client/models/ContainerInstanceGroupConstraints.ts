/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Region } from "./Region";

export type ContainerInstanceGroupConstraints = {
	jurisdiction?: "eu" | "fedramp";
	regions?: Array<Region>;
};
