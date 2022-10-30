import { Octokit } from '@octokit/rest';
import { Content } from './scraper';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

export async function saveContent(content: Content, tags: Array<string>) {
  const addAdditionalInfoToContent = (): string => {
    let metadata: string = `---\ntitle: "${content.title}"\nsource: "${content.url}"\ntags:`
    for (let i = 0; i < tags.length; i++) {
      metadata += `\n- ${tags[i]}`
    }
    metadata += '\n---\n'

    const disclaimerText: string = `DISCLAIMER: This is bookmarked article just for easy reference, please go to [here](${content.url}) to see the original article.`

    return `${metadata}\n${disclaimerText}\n${content.data}`
  }

  //TODO: handle duplication content
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: 'irfansofyana',
    repo: 'MySecondBrain',
    branch: 'hugo',
    path: `content/bookmark/${content.domain}/${content.title}.md`,
    message: `Bookmarked: ${content.title}.md`,
    content: Buffer.from(addAdditionalInfoToContent()).toString('base64'),
  })
}
