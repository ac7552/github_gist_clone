class GistsController < ApplicationController
  before_action :set_gist, only: [:show, :edit, :update, :destroy]

  def index
    @all_gist = Gist.all
  end

  def show
  end

  def update
    new_records = []
    current_old_records = Hash.new(0)
    gist_params[:gist_files_attributes].keys.each do |key|
      #use strong params and reconstruct object for saving
      gist_file_id = gist_params[:gist_files_attributes][key][:id]
      gist_file_record = {
        id: gist_file_id,
        file_content: gist_params[:gist_files_attributes][key][:file_content],
        extension_type: gist_params[:gist_files_attributes][key][:extension_type],
        gist_id: gist_params[:id]
      }
      #if gist file id empty then it's a new record/otherwise assign to hash
      if gist_file_id.empty?
        new_records << gist_file_record
      else
        current_old_records[gist_file_id] =  gist_file_record
      end
    end
    #convert ids to ints
    current_old_record_ids = current_old_records.keys.map {|id| id.to_i }
    actual_db_records = @gist.gist_files.pluck(:id)
    #compare old ids with updated ids from front end
    records_to_remove = actual_db_records - current_old_record_ids

    #create newly linked gist_files
    GistFile.create(new_records)
    #update gist description
    @gist.update(description: gist_params[:description])
    #remove gist_files that have been removed on front end
    @gist.gist_files.delete(*records_to_remove)
    respond_to do |format|
      #update assoc gist files
      if (@gist.update(gist_files_attributes: current_old_records.values))
        format.html  { redirect_to(@gist,
                      :notice => 'Gist was successfully created.') }
        format.json  { render :json => @gist,
                      :status => :created, :location => @gist }
      else
        format.html  { render :action => "new" }
        format.json  { render :json => @gist.errors,
                      :status => :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def new
  end

  def create
    @gist = Gist.new(gist_params)
    respond_to do |format|
      if @gist.save
        format.html  { redirect_to(@gist,
                      :notice => 'Gist was successfully created.') }
        format.json  { render :json => @gist,
                      :status => :created, :location => @gist }
      else
        format.html  { render :action => "new" }
        format.json  { render :json => @gist.errors,
                      :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @gist.destroy
     respond_to do |format|
       format.html { redirect_to gists_url, notice: 'Gist was
       successfully destroyed.' }
       format.json { head :no_content }
     end
  end

  private
  def set_gist
    @gist = Gist.find(params[:id])
  end

  def gist_params
    params.require(:gist).permit(:id, :description, :public, :gist_files_attributes => [:id, :file_content, :extension_type])
  end

end
