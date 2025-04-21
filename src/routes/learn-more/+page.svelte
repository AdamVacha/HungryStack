<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import { goto } from '$app/navigation';

	function navigateToLogin() {
		goto('/login');
	}
</script>

<div class="flex min-h-screen flex-col bg-surface-800 text-white">
	<main class="flex-grow">
		<!-- Hero Section -->
		<section
			class="relative flex flex-col items-center justify-center bg-gradient-to-b from-surface-900 to-surface-800 px-4 py-20 sm:py-32 md:px-8"
		>
			<div class="container mx-auto max-w-6xl">
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
					<div class="flex flex-col justify-center">
						<h1 class="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
							Master Full-Stack Development,
							<span class="text-tertiary-400">One Stack at a Time</span>
						</h1>
						<p class="mb-8 text-lg leading-relaxed text-gray-300">
							Hungry Stack is a gamified learning platform that transforms web development education
							into an engaging, structured journey. Build your stack of skills with interactive
							lessons and earn badges and certificates along the way.
						</p>
						<div class="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
							<button
								onclick={navigateToLogin}
								class="variant-filled-tertiary btn px-6 py-3 text-lg font-semibold"
							>
								Start Learning Now
							</button>
							<a href="#features" class="variant-ghost-surface btn px-6 py-3 text-lg font-semibold">
								Explore Features
							</a>
						</div>
					</div>
					<div class="flex items-center justify-center">
						<img
							src="/images/screenshots/dashboard.png"
							alt="Hungry Stack Dashboard"
							class="rounded-lg shadow-xl"
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- How It Works Section -->
		<section id="how-it-works" class="bg-surface-800 px-4 py-20 md:px-8">
			<div class="container mx-auto max-w-6xl">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold md:text-4xl">How Hungry Stack Works</h2>
					<p class="mx-auto max-w-2xl text-lg text-gray-300">
						Our unique pancake-stacking approach to learning makes web development fun and intuitive
					</p>
				</div>

				<div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
					<div
						class="card flex flex-col items-center p-6 text-center"
						data-aos="fade-up"
						data-aos-delay="0"
					>
						<div class="mb-6 rounded-full bg-tertiary-600 p-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h3 class="mb-2 text-xl font-bold">Four Core Modules</h3>
						<p class="text-gray-300">
							Stack your pancakes with HTML, CSS, JavaScript, and Backend Development modules
						</p>
					</div>

					<div
						class="card flex flex-col items-center p-6 text-center"
						data-aos="fade-up"
						data-aos-delay="100"
					>
						<div class="mb-6 rounded-full bg-tertiary-600 p-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<h3 class="mb-2 text-xl font-bold">Interactive Learning</h3>
						<p class="text-gray-300">
							Real-time code editor with instant preview to practice as you learn
						</p>
					</div>

					<div
						class="card flex flex-col items-center p-6 text-center"
						data-aos="fade-up"
						data-aos-delay="200"
					>
						<div class="mb-6 rounded-full bg-tertiary-600 p-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<h3 class="mb-2 text-xl font-bold">Earn Achievements</h3>
						<p class="text-gray-300">
							Collect badges and certificates to showcase your growing expertise
						</p>
					</div>

					<div
						class="card flex flex-col items-center p-6 text-center"
						data-aos="fade-up"
						data-aos-delay="300"
					>
						<div class="mb-6 rounded-full bg-tertiary-600 p-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
						</div>
						<h3 class="mb-2 text-xl font-bold">Track Progress</h3>
						<p class="text-gray-300">
							Visual progress tracking to see your growth and stay motivated
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Features Section -->
		<section id="features" class="bg-surface-700 px-4 py-20 md:px-8">
			<div class="container mx-auto max-w-6xl">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold md:text-4xl">Platform Features</h2>
					<p class="mx-auto max-w-2xl text-lg text-gray-300">
						Discover the tools and features that make Hungry Stack the ideal platform for learning
						web development
					</p>
				</div>

				<div class="grid grid-cols-1 gap-16 md:gap-24">
					<!-- Feature 1: Interactive Code Editor -->
					<div class="grid grid-cols-1 gap-8 md:grid-cols-2" data-aos="fade-right">
						<div class="order-2 flex flex-col justify-center md:order-1">
							<h3 class="mb-4 text-2xl font-bold md:text-3xl">Interactive Code Editor</h3>
							<p class="mb-6 text-lg text-gray-300">
								Practice in real-time with our powerful code editor that shows your results
								instantly. Perfect for learning HTML, CSS, and JavaScript with immediate visual
								feedback.
							</p>
							<ul class="space-y-2 text-gray-300">
								<li class="flex items-center">
									<svg
										class="mr-2 h-5 w-5 text-tertiary-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									Syntax highlighting for multiple languages
								</li>
								<li class="flex items-center">
									<svg
										class="mr-2 h-5 w-5 text-tertiary-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									Live preview updates as you type
								</li>
								<li class="flex items-center">
									<svg
										class="mr-2 h-5 w-5 text-tertiary-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									Code auto-saving to resume where you left off
								</li>
							</ul>
						</div>
						<div class="order-1 flex items-center justify-center md:order-2">
							<img
								src="/images/screenshots/editor.png"
								alt="Interactive Code Editor"
								class="rounded-lg shadow-xl"
							/>
						</div>
					</div>

					<!-- Feature 2: Achievement System -->
					<div class="grid grid-cols-1 gap-8 md:grid-cols-2" data-aos="fade-left">
						<div class="flex items-center justify-center">
							<img
								src="/images/screenshots/badges.png"
								alt="Achievement System"
								class="rounded-lg shadow-xl"
							/>
						</div>
						<div class="flex flex-col justify-center">
							<h3 class="mb-4 text-2xl font-bold md:text-3xl">Achievement System</h3>
							<p class="mb-6 text-lg text-gray-300">
								Stay motivated with our comprehensive badge and certificate system. Earn
								achievements as you master different aspects of web development and showcase your
								skills.
							</p>
							<ul class="space-y-2 text-gray-300">
								<li class="flex items-center">
									<svg
										class="mr-2 h-5 w-5 text-tertiary-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									Collectible badges for different skill levels
								</li>
								<li class="flex items-center">
									<svg
										class="mr-2 h-5 w-5 text-tertiary-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									Downloadable certificates for completed modules
								</li>
								<li class="flex items-center">
									<svg
										class="mr-2 h-5 w-5 text-tertiary-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									Progress tracking to visualize your journey
								</li>
							</ul>
						</div>
					</div>

					<!-- Feature 3: Comprehensive Curriculum -->
					<div class="grid grid-cols-1 gap-8 md:grid-cols-2" data-aos="fade-right">
						<div class="order-2 flex flex-col justify-center md:order-1">
							<h3 class="mb-4 text-2xl font-bold md:text-3xl">Comprehensive Curriculum</h3>
							<p class="mb-6 text-lg text-gray-300">
								A well-structured learning path takes you from basic to advanced concepts across all
								major areas of web development. Our curriculum is designed to build skills
								progressively.
							</p>
							<ul class="space-y-2 text-gray-300">
								<li class="flex items-center">
									<svg
										class="mr-2 h-5 w-5 text-tertiary-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									HTML: From basics to advanced semantics
								</li>
								<li class="flex items-center">
									<svg
										class="mr-2 h-5 w-5 text-tertiary-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									CSS: Styling fundamentals to advanced animations
								</li>
								<li class="flex items-center">
									<svg
										class="mr-2 h-5 w-5 text-tertiary-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									JavaScript: Core concepts to DOM manipulation
								</li>
								<li class="flex items-center">
									<svg
										class="mr-2 h-5 w-5 text-tertiary-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									Backend: Database design and API development
								</li>
							</ul>
						</div>
						<div class="order-1 flex items-center justify-center md:order-2">
							<img
								src="/images/screenshots/certificate.png"
								alt="Comprehensive Curriculum"
								class="rounded-lg shadow-xl"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA Section -->
		<section class="relative bg-gradient-to-r from-surface-900 to-secondary-900 px-4 py-20 md:px-8">
			<div class="container mx-auto max-w-4xl text-center">
				<h2 class="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
					Ready to Start Your Learning Journey?
				</h2>
				<p class="mx-auto mb-8 max-w-2xl text-lg text-gray-200">
					Join thousands of students who are building their web development skills one pancake at a
					time.
				</p>
				<button
					onclick={navigateToLogin}
					class="variant-filled-tertiary btn px-8 py-4 text-lg font-bold"
				>
					Get Started Now
				</button>
			</div>
		</section>

		<!-- FAQ Section -->
		<section class="bg-surface-800 px-4 py-20 md:px-8">
			<div class="container mx-auto max-w-4xl">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
					<p class="mx-auto max-w-2xl text-lg text-gray-300">
						Find answers to common questions about Hungry Stack
					</p>
				</div>

				<div class="space-y-6">
					<div class="card p-6" data-aos="fade-up" data-aos-delay="0">
						<h3 class="mb-2 text-xl font-bold">Is Hungry Stack suitable for complete beginners?</h3>
						<p class="text-gray-300">
							Absolutely! Our curriculum is designed to take you from zero coding knowledge to
							full-stack proficiency, with each lesson building progressively on the previous ones.
						</p>
					</div>

					<div class="card p-6" data-aos="fade-up" data-aos-delay="100">
						<h3 class="mb-2 text-xl font-bold">How long does it take to complete all modules?</h3>
						<p class="text-gray-300">
							The time varies depending on your learning pace and prior experience. On average,
							students complete all four modules in about 3-4 months when studying consistently for
							5-8 hours per week.
						</p>
					</div>

					<div class="card p-6" data-aos="fade-up" data-aos-delay="200">
						<h3 class="mb-2 text-xl font-bold">Are the certificates recognized by employers?</h3>
						<p class="text-gray-300">
							While our certificates showcase your skills and completion of our comprehensive
							curriculum, the real value comes from the practical skills you develop. Our
							project-based approach ensures you build a portfolio that demonstrates your abilities
							to potential employers.
						</p>
					</div>

					<div class="card p-6" data-aos="fade-up" data-aos-delay="300">
						<h3 class="mb-2 text-xl font-bold">Can I learn at my own pace?</h3>
						<p class="text-gray-300">
							Yes! Hungry Stack is designed for self-paced learning. Your progress is saved
							automatically, allowing you to pick up exactly where you left off, whenever it's
							convenient for you.
						</p>
					</div>
				</div>
			</div>
		</section>
	</main>

	<Footer />
</div>

<style>
	.card {
		@apply rounded-lg bg-surface-700;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.card:hover {
		@apply shadow-lg;
		transform: translateY(-5px);
	}
</style>
