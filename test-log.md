# Test Log - Laura de Rohan

When I do a take-home challenge I like to keep a log of my decisions,
so that the people reviewing the test have a better understanding of my thought process.

## :one: Laying out the project (approximately 1/2 hour)

The first thing I did was layout my understanding of the requirements on paper.
I am not going to copy all of this here, but I can share the conclusions I quickly came to:

* We have a given list of **jobs** which are each linked to a list of **employees**, and we want to choose **1 job** and
  display its related **stats** that we can calculate from all its **employees** data.
* That means the first step is to **fetch** all jobs and employees from Prisma
* Then we need to create a **select input** to choose the job by its name
* Then we need to **calculate stats** for this job and **display** them

## :two: Having an MVP (approximately 1 hour)

For the **fetching** of the data, I decided to go with Next's API routes along with swr `useSWR` hook.
This way I was able to handle loading and error state with early returns in the component.
Other options included, but were not limited to, using Next's `getServerSideProps` or `getStaticProps` to pre fetch the
data using prisma client directly in these methods.
But since I was already creating an API route to fetch and calculate the job stats, I thought it was simpler to put all
db interactions in the API route handlers.

For the **select input**, I decided to go with a simple html `<input>` with a `<list>` property that would contain
one `<option>` per job name, with the job id as the `key` attribute.

Then for **fetching and calculating** the job stats once a job is selected, I created a custom API
route `api/jobs/[jobId]` that will fetch all of the jobs employees and calculate the p25, p50 and p75 percentiles on all
the salaries.
I decided to use the library `percentile` so wouldn't have to handle the percentile calculations myself.

Inside the component, I simply used a useCallback hook in which I fetch the data with `axios` and store it in the
component's state, and then display it underneath the input.

:info: I had an issue here with using the job names as values for the datalist of the `input` but accessing the `key`
attribute of the options to retrieve the job id and not name.
For now I decided to simply find the id in the previously found `jobs` array with the name I got from the `input` value,
even though it's not the most elegant.

## :three: Adding typing and clean the code a bit (approximately 10 minutes)

Before moving on to the last part of test I wanted to make sure that the code I wrote was a bit more clean and correctly
typed.
I had trouble with the `percentile()` method that returns either `number[]` or `number[][]`, so I had to unfortunately
typecast it to `number[]`.

I wanted to test the robustness of my app by inserting bigger datasets in the database, using faker to generate fake job
names,
but the seed command failed when trying to insert > 1000 jobs :sad:

I got both these errors:
`Timed out fetching a new connection from the connection pool.`
`Error: Command was killed with SIGABRT (Aborted): ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts`

## :four: Make it pretty (approximately 2 hours)

This was by far the most tedious part. I am not a designer even though I try to use common sense and minimalistic
esthetics,
so I struggled to even know what I wanted the app to look like.

But the most difficult part was to make the statistics data readable and nicely presented.
For this I decided to use the library `chart.js` which I had never used before. I had to read quite a lot of
documentation before understanding what I needed.

I wanted to reproduce a "Floating Bar" graph like the one from
the [Figures's Market Data Browser](https://app.figures.hr/try) but I struggled to go from regular bars (going from 0)
to floating ones.
The trick was to pass one array of data points per label to the `data` object. In my case, I only want one label at a
time (the selected job).

This is what I needed to do: `labels.map(() => [jobStats.p25Salary, jobStats.p75Salary])`.

I wanted to display the median, p25 and p75 salaries just like in the original product demo, so I had to use
a [dataLabel
plugin](https://chartjs-plugin-datalabels.netlify.app/).

I also wanted to display all the stats in a tooltip when we hover on the bar, which I had to customize to contain all
the info, including the sample size.

I wanted to align the bar on the left of the chart in order to see the tooltip on the right side and have no overlap,
but haven't found a way to do so without adding a fake empty category, so I left it in the center.
I decided to display the chart at all times, and to leave it empty when no job is selected.

Then I applied a bit of flexbox with tailwind to align and space everything nicely.
I also switched the colors to use a softer grey as well as pink variants, because pink is the best :unicorn:.

## :thought_balloon: Other features and improvement I could have done

Obviously a lot of things could be added to this use case, here are a few off the top of my head:

* Select multiple jobs to display at the same time, each with their own bar, to compare stats between them
* Calculate more stats, and maybe add the possibility to choose the percentiles to display
* Make it more responsive, more accessible and better looking :smile:
* Design a real select dropdown instead of using native html `list` for the input
* Rework the seed script to insert much more data into the database with Prisma, maybe using transactions
* Work on a pagination system to fetch jobs in chunks instead of all of them