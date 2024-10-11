FROM node:22.9.0-slim

# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (including devDependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Build the application
RUN pnpm run build

# Expose port 8080
EXPOSE 8080

# Start the app
CMD ["pnpm", "start"]