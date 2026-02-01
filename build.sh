#!/bin/bash

echo "🔧 Upgrading RubyGems..."
gem update --system

echo "🔧 Installing latest Bundler..."
gem install bundler

echo "📦 Installing dependencies..."
bundle install

echo "🏗️ Building Jekyll site..."
bundle exec jekyll build
