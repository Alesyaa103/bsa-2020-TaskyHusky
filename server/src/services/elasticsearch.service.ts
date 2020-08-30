import { Client } from '@elastic/elasticsearch';
import { Issue } from '../entity/Issue';

const client = new Client({ node: 'http://localhost:9200' });

interface ElasticI {
	index: string;
}

type BulkCreateOption = { index: { _index: string; _id: string } };

class Elastic implements ElasticI {
	index = 'documentIndex';

	constructor(index: string) {
		this.index = index;
	}

	async createIndexIfNotExist(index: string) {
		const indexExists = await this.indexExists(index);
		if (indexExists.body) {
			return { index };
		}

		return client.indices.create({
			index,
		});
	}

	indexExists(index: string) {
		return client.indices.exists({
			index,
		});
	}

	bulk(issues: Issue[]) {
		const body = [] as (Issue | BulkCreateOption)[];
		issues.forEach((issue) => {
			body.push({ index: { _index: this.index, _id: issue.id } }, issue);
		});
		return client.bulk({ refresh: true, body });
	}

	addData(issue: Issue) {
		return client.index({
			index: this.index,
			id: issue.id,
			body: issue,
		});
	}

	async getMatchedIssueIDs(input: string) {
		const { body } = await client.search({
			index: this.index,
			body: {
				query: {
					query_string: {
						query: `*${input}*`,
						fields: ['description', 'summary'],
					},
				},
			},
		});

		/* eslint no-underscore-dangle: [1, { "allow": ["_id"] }] */
		return body.hits.hits.map((hit: { _id: string }) => hit._id) as string[];
	}

	delete(id: string) {
		return client.deleteByQuery({
			index: this.index,
			body: {
				query: {
					match: { id },
				},
			},
		});
	}
}

export default Elastic;
