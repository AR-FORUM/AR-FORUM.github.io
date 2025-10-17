---
layout: post
title: "Don't (Just) Train For Performance"
date: 2025-10-17 0:00:00 +0000
categories: research training adaptability
tldr: "Extended pre-training improves base model performance but can hurt adaptability—the ability to fine-tune effectively while retaining capabilities. We show this 'catastrophic overtraining' stems from progressive sensitivity to parameter perturbations."
author: "Jacob Springer"
---

You've probably seen confident claims on social media by prominent AI personalities that we already have the ingredients for AGI and simply need to scale. Proponents of this claim often point to one of many graphs illustrating the release date of a model plotted against some measure of performance, showing an exponential grown in capability over time. It's true that today's language models are impressively capable. However, as I will argue in this post, when you actually try to use language models in practice, especially when you want to *adapt* them to new tasks, the picture becomes messier.

## Performance isn't the whole story

Imagine a student fresh out of their very first course on machine learning who decides to fine-tune a few open LMs to solve math word problems. They decide to train on the TinyGSM dataset, which contains examples of math word problems and associated Python programs that compute the solution.

<div class="code-grid">
  <section>
    <h3>Example Prompt (TinyGSM)</h3>
    <pre class="prompt"><code class="nohighlight">A company has $50,000 in profits and wants to pay a bonus to its employees. If the company has 25 employees and the total bonus is $10,000, how much will each employee receive?</code></pre>
  </section>

  <section>
    <h3>Solution</h3>
    <pre><code class="language-python">def simple_math_problem() -> int:
    '''
    A company has $50,000 in profits and wants to pay a bonus to its employees.
    If the company has 25 employees and the total bonus is $10,000, how much will each employee receive?
    '''
    bonus_per_employee = 10000 / 25
    result = bonus_per_employee
    return result</code></pre>
  </section>
</div>

To limit the number of generated tokens, they remove the docstrings and comments from the solution before fine-tuning.

<div class="code-grid">
  <section>
    <h3>Example Prompt (TinyGSM-No-Comments)</h3>
    <pre class="prompt"><code class="nohighlight">A company has $50,000 in profits and wants to pay a bonus to its employees. If the company has 25 employees and the total bonus is $10,000, how much will each employee receive?</code></pre>
  </section>

  <section>
    <h3>Solution (without comments)</h3>
    <pre><code class="language-python">def simple_math_problem() -> int:
    bonus_per_employee = 10000 / 25
    result = bonus_per_employee
    return result</code></pre>
  </section>
</div>

To fine-tune the model, they do everything their class taught them—construct a train/validation split, sweep over a reasonable range of hyperparameters, and then pick the best model based on validation loss. Using this approach, they fine-tune Qwen2.5-3B and Gemma-2B on ~2,000 examples from this modified TinyGSM. After training, they generate from each model and compare the results. Below are sample generations from the models.

### Example Prompt

<pre class="prompt">
Paul wants to buy ingredients for his grilled cheese sandwich. He needs 2 slices of bread that cost $2 each, 1 slice of cheese that costs $3, and some butter that cost $2. How much money does Paul need to buy the ingredients for the grilled cheese sandwich?
</pre>

### Model generations after fine-tuning

<div class="code-grid">
  <section>
    <h3>Qwen2.5-3B</h3>
    <pre><code class="language-python">def simple_math_problem() -> int:
    bread = 2 * 2
    cheese = 3
    butter = 2
    total = bread + cheese + butter
    result = total
    return result</code></pre>
  </section>

  <section>
    <h3>Gemma-2B</h3>
    <pre><code class="language-python">def simple_math_problem() -> int:
    '''
    Paul wants to buy ingredients for his grilled cheese sandwich.
    He needs 2 slices of bread that cost $2 each, 1 slice of cheese that costs $3, and some butter that costs $2.
    How much money does Paul need to buy the ingredients for the grilled cheese sandwich?
    '''
    bread_cost = 2
    cheese_cost = 3
    butter_cost = 2
    num_slices_of_bread = 2
    num_slices_of_cheese = 1
    total_cost = bread_cost * num_slices_of_bread + cheese_cost * num_slices_of_cheese + butter_cost
    result = total_cost
    return result</code></pre>
  </section>
</div>

**Surprise!** For Gemma-2B, the docstrings appear, *even though the fine-tuning data never included them!* Of course, this is inevitably a result of Gemma-2B containing docstrings in its pre-training or mid-training data. But, this raises an important question: why isn't a small format change easy to fine-tune?

It turns out, with not *that* much effort, it is possible to fine-tune Gemma-2B to not include the docstrings, e.g., with better hyperparameter tuning or more data. However, when even open-source models can typically interpret half-formed typo-laden prompts with ease, other aspects, such as adapting the language model *should just work*.

## Adaptability as a first-class goal

The student's struggle reflects a broad issue surrounding language models: **adaptability**. When we post-train or fine-tune, we generally want a model that is both:

- **Plastic:** Adapts easily and reach high downstream performance on the new task.
- **Robust:** Retains the broad capabilities learned during pre-training.

Together, these properties are what I will refer to as *adaptability*.

There's a lot of evidence that larger models are both more plastic and more robust. It's tempting to conclude that scaling grants adaptability "for free". However, as we'll see, this is not the case when we scale models without increasing their parameter count.

## The inference-time wall

Language models are increasingly used for reasoning and agentic tasks, where the tasks demand sometimes thousands or tens of thousands of generated tokens for a single query, making efficient inference-time generation ever more relevant. Moreover, this figure is likely to increase as research and capability progresses.

This demands for the use of tiny language models. However, in order to compensate for their small size, these models are *overtrained*, consuming orders of magnitudes more tokens than the classical Chinchilla scaling laws predict as "train-compute optimal."

The challenge, as we shall see, is that overtraining is terrible for adaptability.

## Case study: post-training OLMo-1B across its trajectory

Consider checkpoints along the [OLMo-1B](https://arxiv.org/abs/2402.00838) training trajectory, from early pre-training to the final 1.3T-token model. For each checkpoint, we track:

1. The base model's general capability, measured by an average score on standard LLM benchmarks.
2. The post-trained model's general capability after instruction tuning (robustness proxy).
3. The post-trained model's instruction-following quality (plasticity proxy).

<figure>
<img src="/assets/images/overtraining/overtraining-olmo.png" alt="Overtraining effects across the OLMo-1B training trajectory">
<figcaption>Figure 2. Overtraining vs. adaptability along the OLMo-1B trajectory.</figcaption>
</figure>

Ideally, all three improve with more pre-training. In practice, early checkpoints improve on both instruction following and general capabilities, but beyond a point (≈2.3T tokens in our narrative) both *decline*, despite the base model's pre-training loss still improving (Figure 2). We call this *catastrophic overtraining*.

> **Definition.** *Catastrophic overtraining* is the phenomenon where extending pre-training continues to improve base-model loss but *reduces* the adaptability and robustness achievable via post-training.

## Why does catastrophic overtraining happen?

To begin to address this question, we turn to a much simpler setting, where we update the model by adding Gaussian noise to the weights. Unsurprisingly, when adding Gaussian noise to the model, its performance—measured by the loss on web data—degrades. However, we can track by how much the performance degrades as a function of the number of tokens the model was pre-trained with.

<figure>
<img src="/assets/images/overtraining/overtraining-gaussian.png" alt="Performance degradation vs. Gaussian noise magnitude across pretraining tokens">
<figcaption>Figure 3. Degradation under fixed-magnitude Gaussian weight noise across checkpoints.</figcaption>
</figure>

For a fixed perturbation magnitude, the amount by which the perplexity of the model degrades increases progressively throughout training. In effect, the model becomes progressively more sensitive to perturbations to its weights as it is pre-trained for longer (Figure 1). We call this *progressive sensitivity*.

At the same time, the performance of the base model improves as we pre-train for longer—so what's going on? As training progresses, the rate at which the base model improves slows down, while the rate at which the model's sensitivity increases speeds up. This means that early in training, when sensitivity is still small, it has a negligible effect on the model, and the performance of the perturbed model improves with training. Later in training, however, the sensitivity of the model dominates the overall loss, leading to a degradation of performance with additional pre-training.

<figure>
<img src="/assets/images/overtraining/overtraining-intuition.png" alt="Schematic intuition for progressive sensitivity and performance trade-off">
<figcaption>Figure 4. Schematic of progressive sensitivity and its interaction with base-model improvement.</figcaption>
</figure>

Crucially, this phenomenon depends on the fact that we kept the magnitude of the perturbation constant for all checkpoints. Smaller perturbations lead to a smaller degradation of the loss, and so if the size of the perturbation were to decrease at the same time as sensitivity increases, then the sensitivity term may never dominate the overall performance, and performance would increase indefinitely.

## Translating this intuition to the fine-tuning setting

Our intuition—that the progressive increase in sensitivity eventually causes the performance of the perturbed model to degrade as sensitivity begins to dominate—nearly carries over to the fine-tuning setting, but we're still missing one crucial piece of the puzzle. The perturbation to the weights from fine-tuning will not necessarily be the same magnitude for different pre-training checkpoints, and therefore we cannot conclude that the loss will necessarily eventually increase.

As it turns out, there is a setting where fine-tuning different checkpoints will yield a (relatively) consistent perturbation magnitude. In particular, this tends to occur when the fine-tuning hyperparameters—especially the peak fine-tuning learning rate—are set to a fixed (untuned) value for all pre-training checkpoints.

<figure>
<img src="/assets/images/overtraining/overtraining-finetuning.png" alt="U-shaped loss curve after fixed-LR post-training across checkpoints">
<figcaption>Figure 5. Fixed learning-rate post-training yields a U-shaped loss vs. token budget.</figcaption>
</figure>

In this setting, where we don't tune the hyperparameters for each checkpoint individually and instead use the same fine-tuning learning rate when post-training all checkpoints, we observe the exact trend we noticed when we perturbed the model with Gaussian noise.

Once again, the degradation induced by fine-tuning increases progressively throughout pre-training, leading to an overall "U"-shaped curve in the loss when evaluating the web-data perplexity of the post-trained model.

## What happens when you tune the learning rate?

In practice, we would never pick a fixed set of hyperparameters. Rather, we would tune our hyperparameters on some downstream task to maximize the performance of the model. Since smaller learning rates lead to smaller fine-tuning perturbations, does this mean that catastrophic overtraining will disappear?

In fact, with our new intuition, we can now revisit our original question: for which datasets does catastrophic overtraining occur? It is exactly the training datasets where achieving strong downstream performance requires larger learning rates. For datasets where the tuned learning rate decreases sufficiently quickly as pre-training is extended, the increase in sensitivity is negated by the decrease in perturbation size. However, for datasets where the tuned learning rate remains sufficiently large, we observe degradation.

<figure>
<img src="/assets/images/overtraining/overtraining-tuning.png" alt="When tuned learning rates mitigate or reveal catastrophic overtraining">
<figcaption>Figure 6. When tuned LRs shrink perturbations fast enough, degradation vanishes; otherwise, it persists.</figcaption>
</figure>

In total, we've established that overtraining can hurt the robustness and the adaptability of the model, and we've attributed this to a progressive increase in sensitivity to parameter perturbations that occurs as we pre-train the foundation model for longer. Thus, as long as the magnitude of the update from fine-tuning remains large enough not to cancel out the increase in sensitivity, we will observe catastrophic overtraining.

## So, pre-train for more than just performance

For small (and overtrained) models, there's a real trade-off between minimizing pre-training loss and preserving adaptability. If the only objective is a better validation loss on the base model, you can end up with a system that's harder to adapt and less robust after post-training. In short: **don't just train for performance—train for adaptability**.
