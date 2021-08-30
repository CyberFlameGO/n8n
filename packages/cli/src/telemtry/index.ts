import rudderAnalytics = require('@rudderstack/rudder-sdk-node');
import { IDataObject } from 'n8n-workflow';
import config = require('../../config');

export class Telemetry {
	private client?: any;
	private instanceId: string;

	constructor(instanceId: string, n8nVersion: string) {
		this.instanceId = instanceId;

		const enabled = config.get('telemetry.enabled') as boolean;
		if (enabled) {
			this.client = new rudderAnalytics(config.get('telemetry.config.backend.key') as string, config.get('telemetry.config.backend.url') as string);
			this.client.identify({
				userId: this.instanceId,
				anonymousId: '000000000000',
				traits: {
					n8n_version: n8nVersion,
				},
			});
		}
	}

	async track(eventName: string, properties?: IDataObject) {
		if (this.client) {
			this.client.track({
				userId: this.instanceId,
				event: eventName,
				anonymousId: '000000000000',
				properties,
			});
		}
	}
}
