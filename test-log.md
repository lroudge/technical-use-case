# Test Log - Laura de Rohan

When I do a take-home challenge I like to keep a log of my decisions,
so that the people reviewing the test have a better understanding of my thought process.

## :one: Laying out the project (approximately 1/2 hour)

The first thing I did was layout my understanding of the requirements on paper.
I am not going to copy all of this here, but I can share the conclusions I quickly came to:

* We have a given list of **jobs** which are each linked to a list of **employees**, and we want to choose **1 job** and display its related **stats** that we can calculate from all its **employees** data.
* That means the first step is to **fetch** all jobs and employees from Prisma
* Then we need to create a **select input** to choose the job by its name
* Then we need to **calculate stats** for this job and **display** them

## :two: Having an MVP (approximately 1 hour)

For the **fetching** of the data, I decided to go with Next's API routes along with swr `useSWR` hook.
This way I was able to handle loading and error state with early returns in the component.
Other options included, but were not limited to, using Next's `getServerSideProps` or `getStaticProps` to pre fetch the data using prisma client directly in these methods.
But since I was already creating an API route to fetch and calculate the job stats, I thought it was simpler to put all db interactions in the API route handlers.

For the **select input**, I decided to go with a simple html `<input>` with a `<list>` property that would contain one `<option>` per job name, with the job id as the `key` attribute.

Then for **fetching and calculating** the job stats once a job is selected, I created a custom API route `api/jobs/[jobId]` that will fetch all of the jobs employees and calculate the p25, p50 and p75 percentiles on all the salaries.
I decided to use the library `percentile` so  wouldn't have to handle the percentile calculations myself.

Inside the component, I simply used a useCallback hook in which I fetch the data with `axios` and store it in the component's state, and then display it underneath the input.

:info: I had an issue here with using the job names as values for the datalist of the `input` but accessing the `key` attribute of the options to retrieve the job id and not name.
For now I decided to simply find the id in the previously found `jobs` array with the name I got from the `input` value, even though it's not the most elegant.

## :three: Adding typing and clean the code a bit

## :four: Make it pretty