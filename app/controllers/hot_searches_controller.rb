class HotSearchesController < ApplicationController
  # GET /hot_searches
  # GET /hot_searches.xml
  def index
    @hot_searches = HotSearch.limit(5)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @hot_searches }
    end
  end

  # GET /hot_searches/1
  # GET /hot_searches/1.xml
  def show
    @hot_search = HotSearch.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @hot_search }
    end
  end

  # GET /hot_searches/new
  # GET /hot_searches/new.xml
  def new
    @hot_search = HotSearch.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @hot_search }
    end
  end

  # GET /hot_searches/1/edit
  def edit
    @hot_search = HotSearch.find(params[:id])
  end

  # POST /hot_searches
  # POST /hot_searches.xml
  def create
    @hot_search = HotSearch.new(params[:hot_search])

    respond_to do |format|
      if @hot_search.save
        format.html { redirect_to(@hot_search, :notice => 'Hot search was successfully created.') }
        format.xml  { render :xml => @hot_search, :status => :created, :location => @hot_search }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @hot_search.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /hot_searches/1
  # PUT /hot_searches/1.xml
  def update
    @hot_search = HotSearch.find(params[:id])

    respond_to do |format|
      if @hot_search.update_attributes(params[:hot_search])
        format.html { redirect_to(@hot_search, :notice => 'Hot search was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @hot_search.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /hot_searches/1
  # DELETE /hot_searches/1.xml
  def destroy
    @hot_search = HotSearch.find(params[:id])
    @hot_search.destroy

    respond_to do |format|
      format.html { redirect_to(hot_searches_url) }
      format.xml  { head :ok }
    end
  end
end
